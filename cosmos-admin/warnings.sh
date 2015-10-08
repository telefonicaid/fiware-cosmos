#! /bin/bash
# Copyright 2015 Telefonica Investigacion y Desarrollo, S.A.U
#
# This file is part of fiware-cosmos.
#
# fiware-cosmos is free software: you can redistribute it and/or
# modify it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# fiware-cosmos is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero
# General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with fiware-cosmos. If not, see http://www.gnu.org/licenses/.
#
# For those usages not covered by this license please contact with
# francisco dot romerobueno at telefonica dot com

# Show the usage
if [ $# -ne 8 ]; then
        echo "Usage: ./warnings.sh <db_host> <db_port> <db_name> <db_user> <db_password> <hdfs_threshold> <num_days> <destination_email> <report_title>"
        exit 1;
fi

# Arguments
dbHost=$1
dbPort=$2
dbName=$3
dbUser=$4
dbPassword=$5
hdfsThreshold=$6
numDays=$7
dstEmail=$8
reportTitle=$9

# Report pieces
parametersReport="--- Parameterization:\ndb_host=$dbHost\ndb_port=$dbPort\ndb_name=$dbName\ndb_user=$dbUser\ndb_password=$dbPassword"
parametersReport="$parametersReport\nhdfs_threshold=$hdfsThreshold\nnum_days=$numDays"
quotaLimitReport="--- Users reaching the quota limit:"
unusedAccountsReport="--- Unused accounts:"

while read -r username; do
        # Common query
        select_result=$(mysql $dbName -u $dbUser -p$dbPassword -se "select hdfs_quota,hdfs_used,registration_time from cosmos_user where username='$username'")
        hdfsQuota=$(echo $select_result | awk '{ print $1 }')
        hdfsUsed=$(echo $select_result | awk '{ print $2 }')
        lastAccessTime=$(echo $select_result | awk '{ print $3 }')

        # Detect users reaching the quota limit
        percentage=$(echo "scale=2;$hdfsUsed.0/$hdfsQuota.0" | bc)
        check=$(echo "$percentage>$hdfsThreshold" | bc)

        if [ $check -eq 1 ]; then
                quotaLimitReport="$quotaLimitReport\n$username: $hdfsQuota (quota) $hdfsUsed (used) $percentage (%)"
        fi

        # Detect unused accounts
        if [ "$lastAccessTime" == "0000-00-00" ]; then
                continue;
        fi

        currentTimeSeconds=$(date +%s)
        lastAccessTimeSeconds=$(date -d $lastAccessTime +%s)
        check=$(echo "($currentTimeSeconds-$lastAccessTimeSeconds)>(86400*$numDays)" | bc)

        if [ $check -eq 1 ]; then
                if [ $hdfsUsed -eq 0 ]; then
                        unusedAccountsReport="$unusedAccountsReport\n$username: $hdfsUsed (used) $lastAccessTime (last access time)"
                fi
        fi
done < <(mysql $dbName -u $dbUser -p$dbPassword -se "select username from cosmos_user")

# Final report
report="### $reportTitle ###\n\n$parametersReport\n\n$quotaLimitReport\n\n$unusedAccountsReport"

# Send an email with the repport
echo -e "$report" | mail -s "Cosmos report" $dstEmail

