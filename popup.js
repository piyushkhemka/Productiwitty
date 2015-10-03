function hesaplama()
{
var sayı1 = window.document.form.deger1.value;
var sayı2 = window.document.form.deger2.value;
var toplam = (parseFloat(sayı1) + parseFloat(sayı2)) ;
window.document.form.cevap.value = toplam;
}
window.onload = function(){
    document.querySelector('input[value="Submit"]').onclick=hesaplama;
}