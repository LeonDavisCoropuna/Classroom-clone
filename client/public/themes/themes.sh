#!/bin/bash

# Lista de URLs
urls=(
  
"https://www.gstatic.com/classroom/themes/img_breakfast.jpg"
"https://www.gstatic.com/classroom/themes/img_code.jpg"
"https://www.gstatic.com/classroom/themes/img_graduation.jpg"
"https://www.gstatic.com/classroom/themes/English.jpg"
"https://www.gstatic.com/classroom/themes/img_backtoschool.jpg"
"https://www.gstatic.com/classroom/themes/img_reachout.jpg"

)

# Contador para nombrar los archivos
counter=1

# Descargar y renombrar cada URL
for url in "${urls[@]}"; do
  filename="classroom-themes-${counter}.jpg"
  echo "Descargando $url como $filename..."
  curl -s "$url" -o "$filename"
  ((counter++))
done

echo "Descarga completada."
