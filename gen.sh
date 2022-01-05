#!/bin/bash
rm -r dist
mkdir dist


files_extra="./src/1_files_extra.runtime"
echo -e "def load_extra_files
 prs _fs '\c" >> $files_extra
python3 -c "
import json
f = open('src/1_files_extra.json')
text = json.dumps(json.load(f))
text = text.replace(\"'\", \"\\\\'\")
print(text, end = '')
f.close()" >> $files_extra
echo "'
 for _d \$_fs
  get \$_fs \$_d _content
  put \$root \$_d \$_content
 nxt
end
cal load_extra_files" >> $files_extra

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

cp $source_js ./docs/js/source.js
rm $source_js
