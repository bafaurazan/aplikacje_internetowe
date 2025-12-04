# installacja
```bash
#tworzenie venv
cd ~/aplikacje_internetowe/imdb-api
python3 -m venv .venv
source .venv/bin/activate


# zależności django
cd ~/aplikacje_internetowe/imdb-api
pip install -r requirements.txt

# zależności vite
cd ~/aplikacje_internetowe/imdb-api
npm create vite@latest frontend
cd ~/aplikacje_internetowe/imdb-api/frontend
npm install
```

# uruchomienie
```bash
#
#
# venv
cd ~/aplikacje_internetowe/imdb-api
source .venv/bin/activate
#
#
#
#backend
cd ~/aplikacje_internetowe/imdb-api
source .venv/bin/activate
python manage.py runserver localhost:8000

#frontend
cd ~/aplikacje_internetowe/imdb-api
source .venv/bin/activate
cd ~/aplikacje_internetowe/imdb-api/frontend
npm run dev
```