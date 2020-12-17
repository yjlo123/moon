#!/bin/bash
rm -r dist
mkdir dist
for filename in ./src/*.runtime; do
	echo $filename
	cat $filename >> ./dist/program.runtime
done

echo '/* Built on' >> ./dist/source.js
echo `date` >> ./dist/source.js
echo '*/' >> ./dist/source.js
echo 'let moonSrc = `' >> ./dist/source.js
cat ./dist/program.runtime >> ./dist/source.js
echo '`' >> ./dist/source.js
sed -i '' 's/\\/\\\\/g' ./dist/source.js

cp ./dist/source.js ./app/js/source.js
