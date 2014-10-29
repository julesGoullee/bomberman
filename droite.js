var tab = [3, 4, 5, 1, 8];

function chercheLePlusPetitNombre( tabNombre ){
    var plusPetit = tabNombre[0];
    var size = tabNombre.length;
    var i = 1;
    for(i; i < size; i++){
        if(plusPetit > tabNombre[i] ){
            plusPetit = tabNombre[i];
        }
    }
    return plusPetit;
}
//console.log(chercheLePlusPetitNombre(tab));


function chercheLePlusGrand( tabNombre ){
    var plusGrand = tabNombre[0];
    var size = tabNombre.length ;
    var i = 1;
    for(i; i<size; i++){
        if(plusGrand < tabNombre[i]){
            plusGrand = tabNombre[i];
        }
    }
    return plusGrand ;
}

//console.log("Le plus grand nombre est : " + chercheLePlusGrand(tab));
function estModuloDe(nombre, modulo){
    return nombre % modulo == 0 ;

}
function estMutilpleDeCinq(nombre){
    estModuloDe(nombre, 5);
}
function estMutilpleDeTrois(nombre){
    estModuloDe(nombre, 3);
}

function afficheLesCentsPremiersNombres(){
    var i = 1;
    var max = 100;
    for(i; i <= max; i++){
        var result;
        if( estMutilpleDeTrois(i) && estMutilpleDeCinq(i)){
            result = "Fizz Buzz";
        }
        else if( estMutilpleDeCinq(i)){
            result = "Buzz";
        }
        else if (estMutilpleDeTrois(i)) {
            result = "Fizz";
        }
        else{
            result = i;
        }
        console.log(result);
    }
}

//afficheLesCentsPremiersNombres();


function Point(x, y, c) {
    this.x = x;
    this.y = y;
    this.name = c;
}

function Droite(a, b){
    this.a = a;
    this.b = b;
    this.estSurLaDroite = function (point){
        return (point.y == this.a*point.x + this.b);
    };
}

function afficherPoint(point){
    console.log(point.name + "(" + point.x + "," + point.y + ")");
}

function unPointSurLaDroite(droite){
    var pointSurLaDroite = new Point(0, droite.b, 'e');
    return pointSurLaDroite;
}

var unPoint = new Point(1, 2, 'H');
var uneDroite = new Droite(1, 1);



//console.log(uneDroite.estSurLaDroite(unPoint));
//afficherPoint(unPoint);
//unPointSurLaDroite(uneDroite);
afficherPoint(unPointSurLaDroite(uneDroite));
