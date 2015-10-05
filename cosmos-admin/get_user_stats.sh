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
if [ $# -ne 5 ]; then
        echo "Usage: ./get_user_stats.sh <db_host> <db_port> <db_name> <db_user> <db_password>"
        exit 1;
fi

# Arguments
dbHost=$1
dbPort=$2
dbName=$3
dbUser=$4
dbPassword=$5

// From string to number months converter
// $1 --> month to be converted
convert_month() {
	local month_str=$1

	case $month_str in 
                Jan )
                        return 1
			;;
                Feb )
                        return 2
			;;
		Mar )
			return 3
			;;
		Apr )
			return 4
			;;
		May )
			return 5
			;;
		Jun )
			return 6
			;;
		Jul )
			return 7
			;;
		Ago )
			return 8
			;;
		Sep )
			return 9
			;;
		Oct )
			return 10
			;;
		Nov )
			return 11
			;;
		Dec )
			return 12
			;;
	esac
}

// Per username iteration
while read -r username; do
	// Get the last access time
	last_result=$(last -R $username | head -n1)
	year=$(date | awk '{ print $6 }')
	convert_month $(echo $last_result | awk '{ print $4 }')
	month=$?
	day=$(echo $last_result | awk '{ print $5 }')
	hour_minute=$(echo $last_result | awk '{ print $6 }')
	last_access_time=$(echo $year-$month-$day $hour_minute:00)
	mysql $dbName -u $dbUser -p$dbPassword -se "update cosmos_user set last_access_time='$last_access_time' where username='$username'"

	// Get the local file system size
	fs_du_result=$(du -chb /home/$username | grep total | awk '{ print $1 }')
	mysql $dbName -u $dbUser -p$dbPassword -se "update cosmos_user set fs_used='$fs_du_result' where username='$username'"

	// Get the HDFS size
	hdfs_du_result=$(hadoop fs -dus /user/$username | awk '{ print $2 }')
	mysql $dbName -u $dbUser -p$dbPassword -se "update cosmos_user set hdfs_used='$hdfs_du_result' where username='$username'"
done < <(mysql $dbName -u $dbUser -p$dbPassword -se "select username from cosmos_user")

