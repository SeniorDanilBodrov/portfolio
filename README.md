# Портфолио Данила Бодрова

Статический сайт-портфолио AI / ML-инженера: Computer Vision, Python, API, автоматизация и MVP.

В кейсах есть FoodSource — сервис поиска и сравнения поставщиков продуктов питания с FastAPI/SQLite, парсером публичных источников, фильтрами, сравнением и XLSX-экспортом. [Открыть демо FoodSource](https://seniordanilbodrov.github.io/foodsource/).

## Локальный запуск

```powershell
& "C:\Users\User\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" -e "require('http').createServer((q,s)=>require('fs').readFile(require('path').join(process.cwd(),q.url==='/'?'index.html':q.url),(e,d)=>{if(e){s.statusCode=404;s.end('Not found')}else{s.end(d)}})).listen(4173)"
```

Открыть `http://localhost:4173`.

## Структура

- `index.html` — семантическая структура лендинга.
- `styles.css` — адаптивная визуальная система.
- `app.js` — мобильная навигация и мягкое появление блоков.
- `public/video` — MP4 и GIF-демо CV-модулей, включая FoodSource.
- `public/documents` — публичные подтверждающие документы с нормализованными именами.
- `ТЗ_сайт_портфолио_Данил_Бодров.md` — исходное техническое задание.

Сайт публикуется как статический GitHub Pages-проект. Для локального запуска достаточно открыть `index.html` через статический сервер.
