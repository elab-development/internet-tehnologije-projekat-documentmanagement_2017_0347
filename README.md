# Instalacija document management sistema

Da bi aplikacija mogla da se pokrene, treba instalirati sledeće programe: VS CODE, XAMPP, COMPOSER, NODE JS 

# Pokretanje aplikacije

 ## Laravel 

    cd internet-tehnologije-projekat-documentmanagement_2017_0347
    composer install 
    copy .env.example .env
    php artisan key:generate 
    php artisan serve 

 ## React

     cd internet-tehnologije-projekat-documentmanagement_2017_0347
     npm install
     npm start

# Opis aplikacije

Ova aplikacija predstavlja platformu za upravljanje dokumentima nekog preduzeća. Funkcionalnosti sistema su dodavanje, brisanje, pretraga, prikaz i skidanje dokumenata. Korisnici mogu pretraživati dokumente putem search bar-a i tagova. Da bi korsinik mogao da koristi aplikaciju, mora da se registruje(napravi nalog). Korisnici koji imaju nalog mogu da se uloguju, izloguju i menjaju lozinku.  
