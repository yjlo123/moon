#!/bin/bash
rm -r dist
mkdir dist

# pro | lite | minimal
flavor="pro"
files_extra="./src/1_files_extra.runtime"
echo -e "def load_extra_files
 prs _fs '\c" >> $files_extra
python3 -c "
import json
import os
if '$flavor' == 'minimal':
    f_json = {'home':{'guest':{}},'programs':{}}
else:
    f = open('src/1_files_extra.json', encoding='utf8')
    f_json = json.load(f)
lite_prog = ['cat','cd','cp','date','dir','echo','edit','ls','mkdir','motd','mv','programs','pwd','rm','touch','uptime']
minimal_prog = ['cat','cd','cp','echo','ls','mkdir','motd','mv','pwd','rm','touch']
for dir in ['programs', 'games']:
    if '$flavor' == 'minimal' and dir != 'programs':
        continue
    for prog in os.listdir(\"src/{}\".format(dir)):
        ff = os.path.join(\"src/{}\".format(dir), prog)
        if os.path.isdir(ff):
            continue
        file_name, ext = prog.split('.')
        if '$flavor' == 'lite' and file_name not in lite_prog:
            continue
        elif '$flavor' == 'minimal' and file_name not in minimal_prog:
            continue
        with open(ff, 'r', encoding='utf8') as f:
            virtual_file = []
            if ext == 'runtime':
                description = f.readline().strip()[1:]
                header = [\"exe\", description]
                virtual_file.append(header)
                row = f.readline()
                while row:
                    row = row.replace('\\\\', '\\\\\\\\')
                    virtual_file.append(row.rstrip())
                    row = f.readline()
            elif ext == 'link':
                header = [\"lnk\", f.readline().strip()]
                virtual_file.append(header)
        f_json[dir][prog.split('.')[0]] = virtual_file
text = json.dumps(f_json)
text = text.replace(\"'\", \"\\\\'\")
print(text, end = '')
f.close()" >> $files_extra

if [ "$(uname -s)" = "Darwin" ]; then
    # on Mac
    sed -i '' 's/\\u/\\\\u/g' $files_extra
else
    # on Linux
    sed -i'' 's/\\u/\\\\u/g' $files_extra
fi

echo "'
 for _d \$_fs
  get \$_fs \$_d _content
  put \$root \$_d \$_content
 nxt
end
cal load_extra_files
let os_build '$(date "+%y%m%d.%H%M")'
let os_flavor '$flavor'
" >> $files_extra

dist_program="./dist/program.runtime"
echo "/Moon OS ($flavor)" >> $dist_program
for filename in ./src/*.runtime; do
	echo $filename
	cat $filename >> $dist_program
done

rm $files_extra

source_js="./dist/source.js"
now=$(date)
echo "/* Built on $now */" >> $source_js
echo 'let moonSrc = `' >> $source_js
cat $dist_program >> $source_js
echo '`' >> $source_js

if [ "$(uname -s)" = "Darwin" ]; then
    # on Mac
    sed -i '' 's/\\/\\\\/g' $source_js
    sed -i '' 's/\\\\\\u/\u/g' $source_js
    sed -i '' 's/\\"/\\\\\\"/g' $source_js
else
    # on Linux
    # SEDOPTION=
    # if [[ "$OSTYPE" == "darwin"* ]]; then
    #   SEDOPTION="-i ''"
    # fi
    sed -i''  's/\\/\\\\/g' $source_js
    sed -i''  's/\\\\\\\\u/\\u/g' $source_js
    sed -i''  's/\\\\u/\\u/g' $source_js
    sed -i''  's/\\"/\\\\\\"/g' $source_js
fi

cp $source_js ./docs/js/source.js
rm $source_js
