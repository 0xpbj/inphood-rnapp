#!/bin/bash
#
# Take all csv files in the current directory and convert them to json files, skipping linesToSkip
# initial lines and indenting spacesToIndent spaces. The json that is output will be an array of 
# objects keyed to keyForArrayOfObjects.
#
# JSON really puffs up the size of the file--to combat that, we've modified the headers in the csv
# files prior to converting them to JSON (each header in the csv file gets replicated n-times in
# the JSON output.
#
# The heavy-lifting in this script is done by this tool: http://csvkit.readthedocs.io/en/latest/scripts/csvjson.html
#
linesToSkip=8
spacesToIndent=2
keyForArrayOfObjects=Description

# Getopts fun below from: http://stackoverflow.com/questions/192249/how-do-i-parse-command-line-arguments-in-bash
#
# A POSIX variable
OPTIND=1         # Reset in case getopts has been used previously in the shell.

# Initialize our own variables:
output=""

while getopts "o" opt; do
    case "$opt" in
    o)  output="optimized"
        ;;
    esac
done

shift $((OPTIND-1))

[ "$1" = "--" ] && shift


for csv_file in *.csv; do
    fileName=${csv_file%.csv}
    jsonFileName=${fileName}.json
    optJsonFileName=$fileName.opt.json

    if [[ "$output" = "optimized" ]]; then
        echo "Creating ${optJsonFileName} ..."

        # This next section is somewhat fragile--it's creating an optimized json output (~60% the size of the one above).
        # It's fragile because it depends on the indentation spaces etc.
        
        # Using perl for multi-line search/replace of empty field, 0pe explanation:
        #   -0 sets the record separator to null, so the whole file will be read at once instead of line-by-line. 
        #   -p makes it print the result after the substitution. 
        #   -e has it take the next argument as the expression to run
        #
        tail -n +${linesToSkip} ${csv_file} \
            | csvjson -k ${keyForArrayOfObjects} -i ${spacesToIndent} \
            | sed 's/NDB_NO/NDB/g' \
            | sed 's/Protein(g)Per 100 g/Protein/g' \
            | sed 's/Carbohydrate, by difference(g)Per 100 g/Carbohydrate/g' \
            | sed 's/Total lipid (fat)(g)Per 100 g/Fat/g' \
            | perl -0pe 's/, \n    \"\": \"\"//g' \
            | grep -v "Description" \
            > ${optJsonFileName}
    else
        echo "Creating ${jsonFileName} ..."

        tail -n +${linesToSkip} ${csv_file} \
            | csvjson -k ${keyForArrayOfObjects} -i ${spacesToIndent} \
            > ${jsonFileName} 
    fi
done
