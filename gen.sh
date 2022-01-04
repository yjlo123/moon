#!/bin/bash
rm -r dist
mkdir dist
rm ./src/1files_extra.runtime
touch ./src/1files_extra.runtime
echo 'def load_extra_files' >> ./src/1files_extra.runtime
echo -e " prs _fs '\c" >> ./src/1files_extra.runtime
python3 -c "import json; f=open('src/1files_extra.json'); print(json.dumps(json.load(f)), end = '');f.close()" >> ./src/1files_extra.runtime
echo "'" >> ./src/1files_extra.runtime
echo " for _d \$_fs" >> ./src/1files_extra.runtime
echo "  get \$_fs \$_d _content" >> ./src/1files_extra.runtime
echo "  put \$root \$_d \$_content" >> ./src/1files_extra.runtime
echo " nxt" >> ./src/1files_extra.runtime
echo "end" >> ./src/1files_extra.runtime
echo "cal load_extra_files" >> ./src/1files_extra.runtime

for filename in ./src/*.runtime; do
	echo $filename
	cat $filename >> ./dist/program.runtime
done

rm ./src/1files_extra.runtime

echo '/* Built on' >> ./dist/source.js
echo `date` >> ./dist/source.js
echo '*/' >> ./dist/source.js
echo 'let moonSrc = `' >> ./dist/source.js
cat ./dist/program.runtime >> ./dist/source.js
echo '`' >> ./dist/source.js
sed -i '' 's/\\/\\\\/g' ./dist/source.js

cp ./dist/source.js ./docs/js/source.js
rm ./dist/source.js
