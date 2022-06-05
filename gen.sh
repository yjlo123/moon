#!/bin/bash
rm -r dist
mkdir dist


files_extra="./src/1_files_extra.runtime"
echo -e "def load_extra_files
 prs _fs '\c" >> $files_extra
python3 -c "
import json
import os
f = open('src/1_files_extra.json')
f_json = json.load(f)
for dir in ['programs', 'games']:
    for prog in os.listdir(\"src/{}\".format(dir)):
        ff = os.path.join(\"src/{}\".format(dir), prog)
        if os.path.isdir(ff):
            continue
        ext = prog.split('.')[-1]
        with open(ff, 'r') as f:
            virtual_file = []
            if ext == 'runtime':
                description = f.readline().strip()[1:]
                header = [\"exe\", description]
                virtual_file.append(header)
                row = f.readline()
                while row:
                    virtual_file.append(row.strip())
                    row = f.readline()
            elif ext == 'link':
                header = [\"lnk\", f.readline().strip()]
                virtual_file.append(header)
        f_json[dir][prog.split('.')[0]] = virtual_file
text = json.dumps(f_json)
text = text.replace(\"'\", \"\\\\'\")
print(text, end = '')
f.close()" >> $files_extra
sed -i '' 's/\\u/\\\\u/g' $files_extra
echo "'
 for _d \$_fs
  get \$_fs \$_d _content
  put \$root \$_d \$_content
 nxt
end
cal load_extra_files
let os_build '$(date "+%y%m%d.%H%M")'
" >> $files_extra

dist_program="./dist/program.runtime"
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
sed -i '' 's/\\/\\\\/g' $source_js
sed -i '' 's/\\\\\\u/\u/g' $source_js

cp $source_js ./docs/js/source.js
rm $source_js
