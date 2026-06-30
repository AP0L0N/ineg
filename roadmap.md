kot dogovrjeno pošiljam ponudbo za nadgradnjo [ineg.si](http://ineg.si/)

Kot smo govorili na sestanku bi naredili predvsem fokus na sledeče:

- Celovito posodobitev naslovne strani 
- Posodobitev glavne navigacije z bolj primerno vsebino + dodan search
- Celovito posodobitev podstrani lesene terase (in hkrati naredimo to storitev najbolj izpostalvjeno)
- Posodibitev SEO (predvsem tehnična posodobitev blogov in pregled stanja indexiranja na Google-u in tam rešiti morebitne napake) -- postaviti stran ponovno "na zemljevid" :) 
- Tehnične posodobitve v ozadju za AI SEO 
- Manjše posodobitve za dostopnost (načeloma je page že OK .. ampak glede na to, da je tole zelo "in" v 2026 bi vseeno šel še enkrat skozi)
- Pregled obstoječih modulov in manjši vizualni popravki (da se lahko ponovno uporabijo za pregled cen itd.)
- E-mail obvestila (to bomo prestavili iz vaših SMTP strežnikov na neko native rešitev, da se ne zgodi ponovno, da bi se emaili prenehali pošiljati)  
- Tehnične posodobitve (CraftCMS 3 je obvezno potrebno prestaviti na sodobnejšo verzijo, ker 3ka niti [ni več podprta z varnostnimi posodobitvami](https://craftcms.com/knowledge-base/supported-versions) že od maja 2024) 
- Za posodobljeno naslovno stran in lesene terase bi vnesel tudi primer vsebine (finalno bi uredili naknadno z vašo pomočjo)  
- Ostale manjše spremembe bodo zajete v ceno


--------

Based on the description .. please help me freshen up this website .. create some new modules (frontend only with sample data .. I'll handle the content and CMS) + upgrading to CMS 5.

My workflow is to 
- add .scss for each new/existing module to web/assets/sass/modules and then import it to #file:custom.scss 
- add twig to templates/_matrix (that I then load throughj backend via #file:index.twig  - so don't bother with on how to actually include the file)
- and if needed add neccesery js to web/assets/babe/custom.js 

I need to sprusen up the page basically .. especially homepage and make "lesene terase" their core business. 

You can actually just create a sample homepage.twig and manually include the modules in these with sample data for easier preview (removing the need CMS for now). 

Make the page professional for their line of work .. modern actually. I need to implement good SEO practivces for AI and Google (with good content etc).

These are the final production pages currently for reference: 
https://ineg.si/
https://ineg.si/lesene-terase