#!/bin/bash

# Define mapping of variants
declare -A MAP=(
  ["TakeMeOut"]="TakeMeOut"
  ["takeMeOut"]="takeMeOut"
  ["TAKEMEOUT"]="TAKEMEOUT"
  ["takemeout"]="takemeout"
  ["TAKMeOut"]="TAKMeOut"
)

# Replace text inside files
echo "🔄 Replacing text inside files..."
for variant in "${!MAP[@]}"; do
  replacement="${MAP[$variant]}"
  grep -rl --exclude-dir=".git" "$variant" . | xargs sed -i "s/$variant/$replacement/g"
done

# Rename files and directories
echo "📁 Renaming files and directories..."
find . -depth | while read -r path; do
  new_path="$path"
  for variant in "${!MAP[@]}"; do
    replacement="${MAP[$variant]}"
    base_name="$(basename "$new_path")"
    dir_name="$(dirname "$new_path")"
    new_base="${base_name//$variant/$replacement}"
    new_path="$dir_name/$new_base"
  done

  if [[ "$path" != "$new_path" ]]; then
    mv "$path" "$new_path"
    echo "✅ Renamed: $path -> $new_path"
  fi
done

echo "🎉 Done. All 'takemeout' variants replaced with 'takemeout'."
