#! /bin/bash
# Copyright 2016 Telefonica Investigacion y Desarrollo, S.A.U
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
if [ $# -ne 7 ]; then
	echo "Usage: ./data_copier.sh <usernames_file> <src_cluster_URL> <dst_cluster_URL> <max_bytes_transfer> <superuser> <superuser_token> <tmp_folder>"
	exit 1;
fi

# Arguments
usernamesFile=$1
srcClusterURL=$2
dstClusterURL=$3
maxBytesTransfer=$4
superuser=$5
superuserToken=$6
tmpFolder=$7

# Create a temporal working directory
tmpDir=$(mktemp -d $tmpFolder/data_copier.XXXX)

# Migrates a given path
# $1 : path to be migrated
# $2 : username owning of the path
migrate() {
	local path=$1
	local username=$2
	local index=1

	# Iterate on the entries of the path
	while read -r entry; do
		# Check the type of the entry by getting its size (0 bytes for directories)
		length=$(curl -X GET "$srcClusterURL/webhdfs/v1$path?op=liststatus&user.name=$superuser" -H "X-Auth-Token: $superuserToken" \
			2> /dev/null | python -m json.tool | grep length | awk '{ print $2 }' | sed 's/"//g' | sed 's/,//g' | sed $index'q;d')

		if test $length -eq 0; then
			echo "$srcClusterURL/webhdfs/v1$path/$entry is a directory"
			# Create the directory in the destination cluster with appropriate ownership
			curl -X PUT "$dstClusterURL/webhdfs/v1$path/$entry?op=mkdirs&user.name=$superuser" -H "X-Auth-Token: $superuserToken" \
				2> /dev/null > /dev/null
			curl -X PUT "$dstClusterURL/webhdfs/v1$path/$entry?op=setowner&owner=$username&group=$username&user.name=$superuser" \
				-H "X-Auth-Token: $superuserToken" 2> /dev/null > /dev/null
			# This directory must be migrated as well in a recursive fashion
			migrate $path/$entry $username
		else
			echo "$srcClusterURL/webhdfs/v1$path/$entry is a file ($length bytes)"
			# Check if the file may be allocated in the temporal folder
			available=$(df -k $tmpFolder | grep -v Filesystem | awk '{ print $4 }')

			if [ $available -lt $length ]; then
				echo "Not enough local disk space for allocating the HDFS file, it will not be copied!"
				continue
			fi

			# Create a temporal file for downloading the entire HDFS file
			tmpFile=$(mktemp $tmpDir/file.XXXX)
			# Download the HDFS file
			curl -X GET "$srcClusterURL/webhdfs/v1$path/$entry?op=open&user.name=$superuser" -H "X-Auth-Token: $superuserToken" \
				-o $tmpFile 2> /dev/null
			echo "$srcClusterURL/webhdfs/v1$path/$entry successfully downloaded"
			# Get the number of chunks according to the maximum number of bytes allowed for transferring
			numChunks=$(($length/$maxBytesTransfer))
			echo "Number of chunks: $numChunks"

			# Copy each chunk into a HDFS file in the destination cluster
			for i in `seq 0 $numChunks`; do
				# Get the offset and number of bytes to be transferred for the current chunk
				offset=$(($i*$maxBytesTransfer))

				if test $i -eq $numChunks; then
					bytes=$(($length-$offset))
				else
					bytes=$maxBytesTransfer
				fi

				echo "Transferring chunk $i ($bytes bytes)"

				# Depending on the chunk, the file must be created with initial content or the data appended
				if test $i -eq 0; then
					# This is the first chunk, thus create the file
					dd if=$tmpFile ibs=1 skip=0 count=$bytes 2> /dev/null | \
						curl -L --data-binary @- -X PUT "$dstClusterURL/webhdfs/v1$path/$entry?op=create&user.name=$superuser" \
						-H "X-Auth-Token: $superuserToken" -H "Content-Type: application/octet-stream" 2> /dev/null > /dev/null
				else
					# This is other chunk, thus append the data
					dd if=$tmpFile ibs=1 skip=$offset count=$bytes 2> /dev/null | \
						curl -L --data-binary @- -X POST "$dstClusterURL/webhdfs/v1$path/$entry?op=append&user.name=$superuser" \
						-H "X-Auth-Token: $superuserToken" -H "Content-Type: application/octet-stream" 2> /dev/null > /dev/null
				fi
			done

			# Change the ownership of the new HDFS file
			curl -X PUT "$dstClusterURL/webhdfs/v1$path/$entry?op=setowner&owner=$username&group=$username&user.name=$superuser" \
				-H "X-Auth-Token: $superuserToken" 2> /dev/null > /dev/null
			# Remove the temporal file
			rm $tmpFile
		fi

		index=$((index+1))
	done < <(curl -X GET "$srcClusterURL/webhdfs/v1$path?op=liststatus&user.name=$superuser" -H "X-Auth-Token: $superuserToken" 2> /dev/null | \
		python -m json.tool | grep pathSuffix | awk '{ print $2 }' | sed 's/"//g' | sed 's/,//g')
}

# Main function
while read -r username; do
	# Create the base path in the destination cluster
	curl -X PUT "$dstClusterURL/webhdfs/v1/user/$username?op=mkdirs&user.name=$superuser" -H "X-Auth-Token: $superuserToken" \
		2> /dev/null > /dev/null
	curl -X PUT "$dstClusterURL/webhdfs/v1/user/$username?op=setowner&owner=$username&group=$username&user.name=$superuser" \
		-H "X-Auth-Token: $superuserToken" 2> /dev/null > /dev/null
	# Start by migrating the base path
	migrate /user/$username $username
done < <(cat $usernamesFile)

# Remove the temporal working directory
rm -r $tmpDir
