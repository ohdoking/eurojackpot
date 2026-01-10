import sys
import re

js_content = sys.stdin.read()
lines = js_content.splitlines()

new_lines = []
in_commented_translations_block = False

for line in lines:
    # Check for the start of the commented-out translations block
    if re.search(r'^\s*//\s*const translations\s*=\s*{', line):
        in_commented_translations_block = True
        continue # Skip this line

    # Check for the end of the commented-out translations block
    if in_commented_translations_block and re.search(r'^\s*//\s*};', line):
        in_commented_translations_block = False
        continue # Skip this line

    # If inside the block, skip the line
    if in_commented_translations_block:
        continue

    # Fix destructuring assignment
    if "const [allDraws, translations ]= await fetchData();" in line:
        new_lines.append(line.replace("const [allDraws, translations ]= await fetchData();", "  const { allDraws: fetchedDraws, translations: fetchedTranslations } = await fetchData();"))
        continue

    new_lines.append(line)

print("\n".join(new_lines))
