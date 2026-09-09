function pridobiPodatke() {
    // tale bi še bil lahko rezerva: https://documenter.getpostman.com/view/4021156/SVtWvmVu?version=latest
    var g_tecaj_btc = 0;
/*    
    // cmc
    //var url = 'https://api.coinmarketcap.com/v1/ticker/?limit=0&convert=EUR'; 
	var url = 'https://cors.io/?https://api.alternative.me/v1/ticker/?convert=EUR';
    console.log('Start');
    var promise = $.getJSON(url); //var promise = $.getJSON(url, {_: new Date().getTime()});
    promise.done(function(data) {
        console.log('Reading done.');
        // preberi vse valute        
        var myValute = [];
        for(var i=0; i<portfelj.valute.length; i++) {
            myValute[myValute.length] = {lokacija:      portfelj.valute[i].lokacija,
                                         sort:          parseInt(portfelj.valute[i].sort),
                                         valuta:        portfelj.valute[i].valuta,
                                         valuta_ime:    '',
                                         kolicina:      parseFloat(portfelj.valute[i].znesek),
                                         nabavna_cena:  parseFloat(portfelj.valute[i].povprecna_nabavna_cena),
                                         procent_1h:    0,
                                         procent_24h:   0,
                                         procent_7dh:   0,
                                         tecaj:         0, //1
                                         tecaj_1h:      0, //1,
                                         tecaj_24h:     0, //1,
                                         tecaj_7d:      0, //1,
                                         vrednost:      0, //parseFloat(portfelj.valute[i].znesek),
                                         vrednost_1h:   parseFloat(portfelj.valute[i].znesek),
                                         vrednost_24h:  parseFloat(portfelj.valute[i].znesek),
                                         vrednost_7d:   parseFloat(portfelj.valute[i].znesek)
                                        };
        }

        // dopolni s tečajem
        for(var j=0; j<data.length; j++) {
            for(var v=0; v<myValute.length; v++) {
                if ( ( !((myValute[v].valuta == 'BAT')||(myValute[v].valuta == 'CAN')||(myValute[v].valuta == 'ACC')) && (myValute[v].valuta == data[j].symbol)) ||
                     ((myValute[v].valuta == 'CBST') && (data[j].symbol == 'BLX')) ||
                     ((myValute[v].valuta == 'BAT')  && (myValute[v].valuta == data[j].symbol) && (data[j].id == "basic-attention-token")) ||
                     ((myValute[v].valuta == 'CAN')  && (myValute[v].valuta == data[j].symbol) && (data[j].id == "canyacoin")) ||
					 ((myValute[v].valuta == 'ACC')  && (myValute[v].valuta == data[j].symbol) && (data[j].id == "adcoin"))
                   ) {
                    myValute[v].valuta_ime   = data[j].name;
                    myValute[v].procent_1h   = parseFloat(data[j].percent_change_1h);
                    myValute[v].procent_24h  = parseFloat(data[j].percent_change_24h);
                        if (data[j].percent_change_24h == null) console.log(myValute[v].valuta_ime + ' nima tečaja 24h');
                    myValute[v].procent_7d   = parseFloat(data[j].percent_change_7d);
                        if (data[j].percent_change_7d == null) console.log(myValute[v].valuta_ime + ' nima tečaja 7d');
                    if (myValute[v].procent_7d = 'NaN') { myValute[v].procent_7d = myValute[v].procent_24h; }
                    myValute[v].tecaj        = parseFloat(data[j].price_eur);
                    if (myValute[v].valuta == 'CBST') {
                        myValute[v].tecaj = myValute[v].tecaj * 0.832643735;
                    }
                    myValute[v].tecaj_1h     = myValute[v].tecaj / (1 + (myValute[v].procent_1h/100));
                    myValute[v].tecaj_24h    = myValute[v].tecaj / (1 + (myValute[v].procent_24h/100));
                    myValute[v].tecaj_7d     = myValute[v].tecaj / (1 + (myValute[v].procent_7d/100));
                    myValute[v].vrednost     = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * myValute[v].tecaj_1h;
                    myValute[v].vrednost_24h = myValute[v].kolicina * myValute[v].tecaj_24h;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * myValute[v].tecaj_7d;
                }
                if (myValute[v].valuta == 'EUR') {
                    myValute[v].tecaj = 1;
                    myValute[v].vrednost     = myValute[v].kolicina * 1;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * 1;
                    myValute[v].vrednost_24h = myValute[v].kolicina * 1;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * 1;
                }
                if (myValute[v].valuta == 'BLX') {
                    myValute[v].tecaj = 2.059; //2.0339 * 0.813338756;
                    myValute[v].vrednost     = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_24h = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * myValute[v].tecaj;
                }
                if (myValute[v].valuta == 'CBST') {
                    myValute[v].tecaj = 2,16; //1.3556 * 0.813338756;
                    myValute[v].vrednost     = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_24h = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * myValute[v].tecaj;
                }
            }
        }
        //for(var v=0; v<myValute.length; v++) console.log(myValute[v].valuta +': '+ myValute[v].tecaj +'#'+ myValute[v].vrednost);

    
*/
    // alternativa
    var url = 'https://api.coincap.io/v2/assets'; // staro je bilo 2025 nehalo delat: {"data":{"message":"We are deprecating this version of the CoinCap API on March 31, 2025. Sign up for our new V3 API at https://pro.coincap.io/dashboard"},"timestamp":1745052563586}
    // tauko@h 2025
	//var url = 'https://rest.coincap.io/v3/assets?apiKey=ca43d54bbf5881144648ee95c47cb9b25f282fe91d5dae2cd41737eb139802f7'; // glej sources.txt
	// tauko.develop@g 2026
	var url = 'https://rest.coincap.io/v3/assets?apiKey=9c5023610bf234a9352fb84a68b0d8941e7405ae6e923f80bde6e91f809d6954'; // glej sources.txt

    console.log('Start');
    var promise = $.getJSON(url); //var promise = $.getJSON(url, {_: new Date().getTime()});
    promise.done(function(data) {
        console.log('Reading done.');
        // preberi vse valute        
        var myValute = [];
        for(var i=0; i<portfelj.valute.length; i++) {
          if (portfelj.valute[i].valuta == 'EUR') {
             myValute[myValute.length] = {lokacija:      portfelj.valute[i].lokacija,
                                         sort:          parseInt(portfelj.valute[i].sort),
                                         valuta:        portfelj.valute[i].valuta,
                                         valuta_ime:    '',
                                         kolicina:      parseFloat(portfelj.valute[i].znesek),
                                         nabavna_cena:  parseFloat(portfelj.valute[i].povprecna_nabavna_cena),
                                         procent_1h:    0,
                                         procent_24h:   0,
                                         procent_7dh:   0,
                                         tecaj:         1, // zaradi €
                                         tecaj_1h:      1,
                                         tecaj_24h:     1,
                                         tecaj_7d:      1,
                                         vrednost:      parseFloat(portfelj.valute[i].znesek),
                                         vrednost_1h:   parseFloat(portfelj.valute[i].znesek),
                                         vrednost_24h:  parseFloat(portfelj.valute[i].znesek),
                                         vrednost_7d:   parseFloat(portfelj.valute[i].znesek)
                                        };             
          }
          else {
            myValute[myValute.length] = {lokacija:      portfelj.valute[i].lokacija,
                                         sort:          parseInt(portfelj.valute[i].sort),
                                         valuta:        portfelj.valute[i].valuta,
                                         valuta_ime:    '',
                                         kolicina:      parseFloat(portfelj.valute[i].znesek),
                                         nabavna_cena:  parseFloat(portfelj.valute[i].povprecna_nabavna_cena),
                                         procent_1h:    0,
                                         procent_24h:   0,
                                         procent_7dh:   0,
                                         tecaj:         0, // zaradi €
                                         tecaj_1h:      1,
                                         tecaj_24h:     1,
                                         tecaj_7d:      1,
                                         vrednost:      0,//parseFloat(portfelj.valute[i].znesek),
                                         vrednost_1h:   0,//parseFloat(portfelj.valute[i].znesek),
                                         vrednost_24h:  0,//parseFloat(portfelj.valute[i].znesek),
                                         vrednost_7d:   0//parseFloat(portfelj.valute[i].znesek)
                                        };
          }
        }

        // dopolni s tečajem
        //console.log("data.data.length"+data.data.length);
        //console.log(data);
        for(var j=0; j<data.data.length; j++) {
            //console.log(j+' '+data.data[j].symbol);
            for(var v=0; v<myValute.length; v++) {
                if (myValute[v].valuta == "EUR") myValute[v].tecaj = 1;
				if (myValute[v].valuta == "BTC") g_tecaj_btc = myValute[v].tecaj;
				/* pred 2020
                if ( //( !((myValute[v].valuta == 'BAT')||(myValute[v].valuta == 'CAN')) && (myValute[v].valuta == data[j].short)) ||
                     ((myValute[v].valuta == data[j].short)) ||
                     ((myValute[v].valuta == 'CBST') && (data[j].short == 'BLX')) 
                     //((myValute[v].valuta == 'BAT')  && (myValute[v].valuta == data[j].short) && (data[j].mktcap == "basic-attention-token")) ||
                     //((myValute[v].valuta == 'CAN')  && (myValute[v].valuta == data[j].short) && (data[j].mktcap == "canyacoin"))
                   ) {
                    myValute[v].valuta_ime   = data[j].name;
                    myValute[v].procent_1h   = parseFloat(data[j].cap24hrChange);
                    myValute[v].procent_24h  = parseFloat(data[j].cap24hrChange);
                        if (data[j].cap24hrChange == null) console.log(myValute[v].valuta_ime + ' nima tečaja 24h');
                    myValute[v].procent_7d   = parseFloat(data[j].cap24hrChange);
                        if (data[j].cap24hrChange == null) console.log(myValute[v].valuta_ime + ' nima tečaja 7d');
                    if (myValute[v].procent_7d = 'NaN') { myValute[v].procent_7d = myValute[v].procent_24h; }
                    myValute[v].tecaj        = parseFloat(data[j].price);// usd
                    if (myValute[v].valuta == 'CBST') {
                        myValute[v].tecaj = myValute[v].tecaj * 0.832643735;
                    }
                    myValute[v].tecaj_1h     = myValute[v].tecaj / (1 + (myValute[v].procent_1h/100));
                    myValute[v].tecaj_24h    = myValute[v].tecaj / (1 + (myValute[v].procent_24h/100));
                    myValute[v].tecaj_7d     = myValute[v].tecaj / (1 + (myValute[v].procent_7d/100));
                    myValute[v].vrednost     = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * myValute[v].tecaj_1h;
                    myValute[v].vrednost_24h = myValute[v].kolicina * myValute[v].tecaj_24h;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * myValute[v].tecaj_7d;
                }
                */
                if ( //( !((myValute[v].valuta == 'BAT')||(myValute[v].valuta == 'CAN')) && (myValute[v].valuta == data[j].short)) ||
                     ((myValute[v].valuta == data.data[j].symbol)) ||
                     ((myValute[v].valuta == 'CBST') && (data.data[j].symbol == 'BLX')) 
                     //((myValute[v].valuta == 'BAT')  && (myValute[v].valuta == data[j].short) && (data[j].mktcap == "basic-attention-token")) ||
                     //((myValute[v].valuta == 'CAN')  && (myValute[v].valuta == data[j].short) && (data[j].mktcap == "canyacoin"))
                   ) {

                    myValute[v].valuta_ime   = data.data[j].symbol;
                    myValute[v].procent_1h   = parseFloat(data.data[j].changePercent24Hr);
                    myValute[v].procent_24h  = parseFloat(data.data[j].changePercent24Hr);
                        if (data.data[j].changePercent24Hr == null) console.log(myValute[v].valuta_ime + ' nima tečaja 24h');
                    myValute[v].procent_7d   = parseFloat(data.data[j].changePercent24Hr);
                        if (data.data[j].changePercent24Hr == null) console.log(myValute[v].valuta_ime + ' nima tečaja 7d');
                    if (myValute[v].procent_7d = 'NaN') { myValute[v].procent_7d = myValute[v].procent_24h; }
                    myValute[v].tecaj        = parseFloat(data.data[j].priceUsd);// usd
                    myValute[v].tecaj = myValute[v].tecaj * .88 // usd eur tečaj ... pred 19.09.2023 0.91, pred 08.09.2022 0.95, pred 05.05.2022, pred 19.11.2021 0.8278797702, pred 17.12.2020 0.84, pred 19.08.2020: 0.889165518
                                                                //                   pred 20.04.2025 0.95
                    //console.log("Tečaj "+myValute[v].valuta_ime+"="+myValute[v].tecaj);
                    //if (myValute[v].valuta == 'CBST') { -- to je bilo na economi
                    //    myValute[v].tecaj = myValute[v].tecaj * 0.832643735;
                    //}
                    myValute[v].tecaj_1h     = myValute[v].tecaj / (1 + (myValute[v].procent_1h/100));
                    myValute[v].tecaj_24h    = myValute[v].tecaj / (1 + (myValute[v].procent_24h/100));
                    myValute[v].tecaj_7d     = myValute[v].tecaj / (1 + (myValute[v].procent_7d/100));
                    myValute[v].vrednost     = myValute[v].kolicina * myValute[v].tecaj;
                    myValute[v].vrednost_1h  = myValute[v].kolicina * myValute[v].tecaj_1h;
                    myValute[v].vrednost_24h = myValute[v].kolicina * myValute[v].tecaj_24h;
                    myValute[v].vrednost_7d  = myValute[v].kolicina * myValute[v].tecaj_7d;
                   }
            }
        }

        // naredi sumo valut
        var myValuteSum = [];
        var tmpValut = 0;
        for(var v=0; v<myValute.length; v++) {
            var tmpIndex = -1;
            for(var j=0; j<tmpValut; j++) {
                if (myValuteSum[j].valuta == myValute[v].valuta) { 
                    tmpIndex = j;
                }
            }
            if (tmpIndex == -1 ) {
                var row = {sort:          myValute[v].sort,
                           valuta:        myValute[v].valuta,
                           valuta_ime:    myValute[v].valuta_ime,
                           kolicina:      myValute[v].kolicina,
                           nabavna_cena:  myValute[v].nabavna_cena,
                           procent_1h:    myValute[v].procent_1h,
                           procent_24h:   myValute[v].procent_24h,
                           procent_7dh:   myValute[v].procent_7dh,
                           tecaj:         myValute[v].tecaj,
                           tecaj_1h:      myValute[v].tecaj_1h,
                           tecaj_24h:     myValute[v].tecaj_24h,
                           tecaj_7d:      myValute[v].tecaj_7d,
                           vrednost:      myValute[v].vrednost,
                           vrednost_1h:   myValute[v].vrednost_1h,
                           vrednost_24h:  myValute[v].vrednost_24h,
                           vrednost_7d:   myValute[v].vrednost_7d,
                           procent_port:  0
                          };
                myValuteSum.push(row);
                tmpValut = tmpValut + 1;
            }
            else {
                myValuteSum[tmpIndex].kolicina = myValuteSum[tmpIndex].kolicina + myValute[v].kolicina;
                myValuteSum[tmpIndex].vrednost = myValuteSum[tmpIndex].vrednost + myValute[v].vrednost;
                myValuteSum[tmpIndex].vrednost_1h = myValuteSum[tmpIndex].vrednost_1h + myValute[v].vrednost_1h;
                myValuteSum[tmpIndex].vrednost_24h = myValuteSum[tmpIndex].vrednost_24h + myValute[v].vrednost_24h;
                myValuteSum[tmpIndex].vrednost_7d = myValuteSum[tmpIndex].kolicina + myValute[v].vrednost_7d;
            }
        }
        myValuteSum.sort(function(a,b) {return (a.sort > b.sort) ? 1 : ((b.sort > a.sort) ? -1 : 0);} );         
        
        // suma po lokacijah
        var myLokacije = [];
        var myLokacijeSum = 0;
        var tmpLokacija = "";
        var tmpNumSklop = 0;
        var tmpSumaZaSklop = 0;
        for(var v=0; v<myValute.length; v++) {
            if (myValute[v].lokacija != tmpLokacija ) {
                if (tmpNumSklop != 0) {
                    tmpSumaZaSklop = precise_round(tmpSumaZaSklop, 2);
                    var row = {lokacija: tmpLokacija,  // prejšnja
                               delez:    0,
                               sum:      tmpSumaZaSklop
                              };
                    myLokacije.push(row);
                    myLokacijeSum = parseFloat(myLokacijeSum) + parseFloat(tmpSumaZaSklop);
                }
                tmpSumaZaSklop = 0;
                tmpLokacija = myValute[v].lokacija;
                tmpNumSklop = tmpNumSklop + 1;
                if (parseFloat(myValute[v].vrednost) > 0) {
                    tmpSumaZaSklop = tmpSumaZaSklop = + parseFloat(myValute[v].vrednost);
                }
            }
            else {
                if (parseFloat(myValute[v].vrednost) > 0) {
                    tmpSumaZaSklop = parseFloat(tmpSumaZaSklop) + parseFloat(myValute[v].vrednost);
                }
            }
        }
        tmpSumaZaSklop = precise_round(tmpSumaZaSklop, 2);
        var row = {lokacija: tmpLokacija,
                   delez:    0,
                   sum:      tmpSumaZaSklop
                  };
        myLokacije.push(row);
        myLokacijeSum = parseFloat(myLokacijeSum) + parseFloat(tmpSumaZaSklop);
        myLokacijeSum = precise_round(myLokacijeSum, 2);
        // procent po lokacijah
        for(var l=0; l<myLokacije.length; l++) {
            myLokacije[l].delez = precise_round(100*myLokacije[l].sum/myLokacijeSum, 1);
        }        
        
        // zaokroži detajl
        for(var v=0; v<myValute.length; v++) {
            myValute[v].tecaj = precise_round(myValute[v].tecaj, 4);
            myValute[v].kolicina = precise_round(myValute[v].kolicina, 6); //8
            myValute[v].vrednost = precise_round(myValute[v].vrednost, 2);
        }
        
        // zaokroži sumo
        for(var v=0; v<myValuteSum.length; v++) {
            myValuteSum[v].tecaj = precise_round(myValuteSum[v].tecaj, 2);
            myValuteSum[v].kolicina = precise_round(myValuteSum[v].kolicina, 4);
            myValuteSum[v].vrednost = precise_round(myValuteSum[v].vrednost, 2);
            myValuteSum[v].procent_1h = precise_round(myValuteSum[v].procent_1h, 1);
            myValuteSum[v].procent_24h = precise_round(myValuteSum[v].procent_24h, 1);
            myValuteSum[v].procent_7dh = precise_round(myValuteSum[v].procent_7d, 1);
        }

        // naredi sumo sum
        var mySumVrednost = 0;
        var mySumVrednostBrezEur = 0;
        var mySumVrednost1h = 0;
        var mySumVrednost1hBrezEur = 0;
        var mySumVrednost24h = 0;
        var mySumVrednost24hBrezEur = 0;
        var mySumVrednost7d = 0;
        var mySumVrednost7dBrezEur = 0;
        var mySumDelta1h = 0;
        var mySumDelta24h = 0;
        var mySumDelta7d = 0;
        var mySumProcent1h = 0;
        var mySumProcent24h = 0;
        var mySumProcent7d = 0;
        for(var v=0; v<myValuteSum.length; v++) {
            mySumVrednost = mySumVrednost + parseFloat(myValuteSum[v].vrednost);
            if (myValuteSum[v].valuta != 'EUR') {
                mySumVrednostBrezEur = mySumVrednostBrezEur + parseFloat(myValuteSum[v].vrednost);
                mySumVrednost1hBrezEur = mySumVrednost1hBrezEur + parseFloat(myValuteSum[v].vrednost_1h);
                mySumVrednost24hBrezEur = mySumVrednost24hBrezEur + parseFloat(myValuteSum[v].vrednost_24h);
                mySumVrednost7dBrezEur = mySumVrednost7dBrezEur + parseFloat(myValuteSum[v].vrednost_7d);
            }
            mySumVrednost1h = mySumVrednost1h + parseFloat(myValuteSum[v].vrednost_1h);
            mySumVrednost24h = mySumVrednost24h + parseFloat(myValuteSum[v].vrednost_24h);
            mySumVrednost7d = mySumVrednost7d + parseFloat(myValuteSum[v].vrednost_7d);
        }
console.log("    mySumVrednost(dodatno)=" + mySumVrednost);
        mySumDelta1h = mySumVrednostBrezEur - mySumVrednost1hBrezEur;
        mySumDelta24h = mySumVrednostBrezEur - mySumVrednost24hBrezEur;
        mySumDelta7d = mySumVrednostBrezEur - mySumVrednost7dBrezEur;
        mySumProcent1h = precise_round(100 * ((mySumVrednostBrezEur / mySumVrednost1hBrezEur) - 1), 1);
        mySumProcent24h = precise_round(100 * ((mySumVrednostBrezEur / mySumVrednost24hBrezEur) - 1), 1);
        mySumProcent7d = precise_round(100 * ((mySumVrednostBrezEur / mySumVrednost7dBrezEur) - 1), 1);
        mySumDelta1h = precise_round(mySumDelta1h, 0);
        mySumDelta24h = precise_round(mySumDelta24h, 0);
        mySumDelta7d = precise_round(mySumDelta7d, 0);

        // procent portfolija
        for(var v=0; v<myValuteSum.length; v++) {
            myValuteSum[v].procent_port = precise_round(100*myValuteSum[v].vrednost/mySumVrednostBrezEur, 1);
        }
        
        ///////////////////
        // write to page //
        ///////////////////

        // suma sum
        try {
            document.getElementById("sum_all").innerHTML = numberWithCommas((-1*-1*mySumVrednost+"").split(".")[0]) + '.' + '<small><font color="gray">' + (mySumVrednost+"").split(".")[1].substring(0,2) + '</font></small>' + ' €';
        }
        catch(err) {        
            document.getElementById("sum_all").innerHTML = -1*-1*mySumVrednost*10000000;
        }
        var color_1h  = '<font color="green">+';
        if (mySumDelta1h < 0) { color_1h  = '<font color="red">'};
        var color_24h = '<font color="green">+';
        if (mySumDelta24h < 0) { color_24h  = '<font color="red">'};
        var color_7d  = '<font color="green">+';
        if (mySumDelta7d < 0)  { color_7d  = '<font color="red">'};
        document.getElementById("sum_1h_e").innerHTML  = color_1h  + numberWithCommas(mySumDelta1h)  + '</font>';
        document.getElementById("sum_1h_p").innerHTML  = color_1h  + (mySumProcent1h).toLocaleString('en-US', {minimumFractionDigits: 0})  + ' %</font>';
        document.getElementById("sum_24h_e").innerHTML = color_24h + numberWithCommas(mySumDelta24h) + '</font>';
        document.getElementById("sum_24h_p").innerHTML = color_24h + (mySumProcent24h).toLocaleString('en-US', {minimumFractionDigits: 0}) + ' %</font>';
        document.getElementById("sum_7d_e").innerHTML  = color_7d  + numberWithCommas(mySumDelta7d)  + '</font>';
        document.getElementById("sum_7d_p").innerHTML  = color_7d  + (mySumProcent7d).toLocaleString('en-US', {minimumFractionDigits: 0})  + ' %</font>';
        
        // gavna kartica - suma valut
        for(var v=0; v<myValuteSum.length; v++) {
            if (myValuteSum[v].valuta == 'EUR')
                document.getElementById("sum_valuta_procent_v"+v).innerHTML = '&nbsp;';
            else
                document.getElementById("sum_valuta_procent_v"+v).innerHTML = myValuteSum[v].procent_port + ' %' +
                                                                              '<br/>' + numberWithCommas(precise_round(myValuteSum[v].nabavna_cena, 2)) + ' €';
            var color_tecaj = '';
            if (parseFloat(myValuteSum[v].procent_1h) >= 1) { color_tecaj  = '<font color="green">'};
            if (parseFloat(myValuteSum[v].procent_1h) <= -1) { color_tecaj  = '<font color="red">'};
            document.getElementById("sum_tecaj_v"   +v).innerHTML = '<p class="doubleHeight">'+
                color_tecaj + numberWithCommas((myValuteSum[v].tecaj+"").split(".")[0]) + '.' + '</font>' + '<small><font color="silver">' + (myValuteSum[v].tecaj+"").split(".")[1] + '</font></small>' + ''
                + '</p>';
            var p1h = precise_round(parseFloat(myValuteSum[v].procent_1h), 1);
            if (p1h >= 0) { p1h = '+' + p1h; }
            var p24h = precise_round(parseFloat(myValuteSum[v].procent_24h), 1);
            if (p24h >= 0) { p24h = '+' + p24h; }
            if (parseFloat(myValuteSum[v].procent_1h) >= 0) { preznak = '+'};
            if (myValuteSum[v].valuta != 'EUR' ) {
                document.getElementById("sum_1hp_v"     +v).innerHTML = color_tecaj + '<small>' + p1h + ' %</small></font>'
                                      + '<br/>' +
                                      '<font color="silver"><small>' + p24h + ' %</small></font>';
            }
            else {
                document.getElementById("sum_1hp_v"     +v).innerHTML = '';
            }
          if (myValuteSum[v].kolicina >= 0) {  
            document.getElementById("sum_kolicina_v"+v).innerHTML = '<p class="doubleHeight">'+
                numberWithCommas((myValuteSum[v].kolicina+"").split(".")[0]) + '.' + '<small><font color="silver">' + (myValuteSum[v].kolicina+"").split(".")[1] + '</font></small>';
                + '</p>';
            document.getElementById("sum_vrednost_v"+v).innerHTML = '<p class="doubleHeight">'+ 
                numberWithCommas((myValuteSum[v].vrednost+"").split(".")[0]) + '.' + '<small><font color="silver">' + (myValuteSum[v].vrednost+"").split(".")[1] + '</font></small>' + '';
                + '</p>';
            if (myValuteSum[v].nabavna_cena != null) {
                if ( (myValuteSum[v].tecaj < myValuteSum[v].nabavna_cena) &&
                     (myValuteSum[v].tecaj != 0) ) {
                    document.getElementById("sum_vrednost_v"+v).innerHTML = '<font color="red">' + document.getElementById("sum_vrednost_v"+v).innerHTML + '<font color="red">';
                    // še dodaj znesek nakupa
                    document.getElementById("sum_vrednost_v"   +v).innerHTML = document.getElementById("sum_vrednost_v"   +v).innerHTML +
                                                                            '<small><font color="silver">' + numberWithCommas(precise_round(myValuteSum[v].nabavna_cena*myValuteSum[v].kolicina, 2)) + 
                                                                            '</font></small>';
                    document.getElementById("sum_vrednost_v"   +v).innerHTML = document.getElementById("sum_vrednost_v"   +v).innerHTML +
                                                                            '<br/><small><font color="pink">' + numberWithCommas(precise_round(myValuteSum[v].vrednost-myValuteSum[v].nabavna_cena*myValuteSum[v].kolicina, 2)) + 
                                                                            '</font></small>';
                }
            }
          }
            document.getElementById("sum_vrednost_1h_v" +v).innerHTML = numberWithCommas((myValuteSum[v].vrednost_1h+"").split(".")[0])   + '.' + '<font color="silver">' + (myValuteSum[v].vrednost_1h+"").split(".")[1] + '</font>' + ' €';
            document.getElementById("sum_vrednost_24h_v"+v).innerHTML = numberWithCommas((myValuteSum[v].vrednost_24h+"").split(".")[0])   + '.' + '<font color="silver">' + (myValuteSum[v].vrednost_24h+"").split(".")[1] + '</font>' + ' €';
            document.getElementById("sum_vrednost_7d_v" +v).innerHTML = numberWithCommas((myValuteSum[v].vrednost_7d+"").split(".")[0])   + '.' + '<font color="silver">' + (myValuteSum[v].vrednost_7d+"").split(".")[1] + '</font>' + ' €';
        }
        
        // kartice lokacij - detajli
        var tmpLokacija = "";
        var tmpNumSklop = 0;
        var tmpNumVrstica = 0;
        for(var v=0; v<myValute.length; v++) {
            if (myValute[v].lokacija != tmpLokacija ) {
                tmpLokacija = myValute[v].lokacija;
                tmpNumSklop = tmpNumSklop + 1;
                tmpNumVrstica = 0;
                //
                for(var l=0; l<myLokacije.length; l++) {
                    if (tmpNumSklop != 0) {
                        if (myLokacije[l].lokacija == tmpLokacija) {
                            document.getElementById("sum_lokacija_sklop" + tmpNumSklop).innerHTML = numberWithCommas((myLokacije[l].sum+"").split(".")[0]) + '.' + '<font color="silver">' + (myLokacije[l].sum+"").split(".")[1] + '</font>' + ' €&nbsp;&nbsp;';
                            //console.log(tmpNumSklop+'-'+myLokacije[l].sum);
                        }
                    }
                }
            }
            else {
                tmpNumVrstica = tmpNumVrstica + 1;
            }
            document.getElementById("tecaj_s"   +tmpNumSklop+'v'+tmpNumVrstica).innerHTML = numberWithCommas((myValute[v].tecaj+"").split(".")[0]) + '.' + '<font color="silver">' + (myValute[v].tecaj+"").split(".")[1] + '</font>' + ' €';
          if (myValute[v].kolicina >= 0) {  
              document.getElementById("kolicina_s"+tmpNumSklop+'v'+tmpNumVrstica).innerHTML = numberWithCommas((myValute[v].kolicina+"").split(".")[0]) + '.' + '<font color="silver">' + (myValute[v].kolicina+"").split(".")[1] + '</font>';
              document.getElementById("vrednost_s"+tmpNumSklop+'v'+tmpNumVrstica).innerHTML = numberWithCommas((myValute[v].vrednost+"").split(".")[0]) + '.' + '<font color="silver">' + (myValute[v].vrednost+"").split(".")[1] + '</font>' + ' €';
              if (myValute[v].nabavna_cena != null) {
                  if (myValute[v].tecaj < myValute[v].nabavna_cena) {
                      document.getElementById("vrednost_s"+tmpNumSklop+'v'+tmpNumVrstica).innerHTML = '<font color="red">' + document.getElementById("vrednost_s"+tmpNumSklop+'v'+tmpNumVrstica).innerHTML + '<font color="red">';
                  }
              }
          }
        }
        
        // kartica skupaj po lokacijah
        for(var v=0; v<myLokacije.length; v++) {
            document.getElementById("lokacija_v"       +v).innerHTML = getImgLokacija(myLokacije[v].lokacija, 24) +  myLokacije[v].lokacija;
			document.getElementById("lokacija_delez_v" +v).innerHTML = numberWithCommas((myLokacije[v].delez+"").split(".")[0]) + '.' + '<font color="silver">' + (myLokacije[v].delez+"").split(".")[1] + '</font>' + ' %';
			var l_btc = 0;
			if (g_tecaj_btc != 0)
				l_btc = myLokacije[v].sum / g_tecaj_btc;
            document.getElementById("lokacija_znesek_btc_v"+v).innerHTML = numberWithCommas((l_btc+"").split(".")[0]) + '.' + '<font color="silver">' + (precise_round(l_btc,2)+"").split(".")[1] + '</font>' + ' &#8383;';
            document.getElementById("lokacija_znesek_v"+v).innerHTML = numberWithCommas((myLokacije[v].sum+"").split(".")[0]) + '.' + '<font color="silver">' + (myLokacije[v].sum+"").split(".")[1] + '</font>' + ' €';
        }
		if (g_tecaj_btc != 0)
		    var g_sum_btc = myLokacijeSum / g_tecaj_btc;
		//document.getElementById("sum_lokacije_btc").innerHTML = "BTC " + numberWithCommas((g_sum_btc+"").split(".")[0]) + '.' + '<font color="silver">' + (precise_round(g_sum_btc,2)+"").split(".")[1] + '</font>' + '&nbsp;&nbsp;&nbsp;&nbsp;';
		document.getElementById("sum_lokacije_btc").innerHTML = "" + numberWithCommas((g_sum_btc+"").split(".")[0]) + '.' + '<font color="silver">' + (precise_round(g_sum_btc,2)+"").split(".")[1] + '</font>' + ' &#8383;';
        document.getElementById("sum_lokacije").innerHTML = numberWithCommas((myLokacijeSum+"").split(".")[0]) + '.' + '<font color="silver">' + (myLokacijeSum+"").split(".")[1] + '</font>' + ' €&nbsp;&nbsp;';
		
        //
        // grafi - prestavljeno na konec
        //
        
        //
        // top 15
        //
//document.getElementById("top15_vrednost13").innerHTML = 'X3';        
        var myValuteSumX = Object.create(myValuteSum);
//document.getElementById("top15_vrednost12").innerHTML = 'X2';        
        myValuteSumX.sort(compare_for_sort_desc);
//document.getElementById("top15_vrednost11").innerHTML = 'X1';        
        for(var v=0; v<15; v++) {
            //console.log(v+1 + ". " + myValuteSumX[v].valuta + " " + myValuteSumX[v].vrednost);
            document.getElementById("top15_valuta"+v).innerHTML = getImgValuta(myValuteSumX[v].valuta)+" "+myValuteSumX[v].valuta
                                            + '<br/><font color="silver"><small>'
                                            //+ myValuteSumX[v].procent_port + ' %'
                                            + 'N=' + numberWithCommas(precise_round(myValuteSumX[v].nabavna_cena, 2)) + ' €'
                                            + '<br>A=' + numberWithCommas(precise_round(myValuteSumX[v].tecaj, 2)) + ' €'
                                            + '</small></font>';
            document.getElementById("top15_delez"+v).innerHTML = myValuteSumX[v].procent_port + ' %';
            document.getElementById("top15_kolicina"+v).innerHTML = numberWithCommas((myValuteSumX[v].kolicina+"").split(".")[0]) + '.' + '<font color="silver">' + (myValuteSumX[v].kolicina+"").split(".")[1] + '</font>';
            l_btc = myValuteSumX[v].vrednost / g_tecaj_btc;
            document.getElementById("top15_btc"+v).innerHTML = numberWithCommas((l_btc+"").split(".")[0]) + '.' + '<font color="silver">' + (precise_round(l_btc,2)+"").split(".")[1] + '</font>' + ' &#8383;';
            document.getElementById("top15_vrednost"+v).innerHTML = numberWithCommas((myValuteSumX[v].vrednost+"").split(".")[0]) + '.' + '<font color="silver">' + (myValuteSumX[v].vrednost+"").split(".")[1] + '</font>' + ' €';
        }
//document.getElementById("top15_vrednost14").innerHTML = 'X';

        //
		// grafi
		//
		google.charts.load('current', {'packages':['corechart']});
		google.charts.setOnLoadCallback(drawChart);

		// Draw the chart and set the chart values
		function drawChart() {
		  /*
		  var data = google.visualization.arrayToDataTable([
			  ['Task', 'Hours per Day'],
			  ['Work', 8],
			  ['Eat', 2],
			  ['TV', 4],
			  ['Gym', 2],
			  ['Sleep', 8]
			]);
          */
		  //my_array = [['Lokacija', 'Znesek'],['A',8],['B',2]];
		  my_array = [['Lokacija', 'Znesek']];
		  for(var v=0; v<myLokacije.length; v++) {
			  if (myLokacije[v].delez > 0.1) {
			    my_item = [myLokacije[v].lokacija, parseFloat(myLokacije[v].sum)];
	 		    my_array.push(my_item);
  			  }
		  }
		  var data = google.visualization.arrayToDataTable(my_array);

		  // Optional; add a title and set the width and height of the chart
		  var options = {'title':'Lokacije', 'width':530, 'height':300};

		  // Display the chart inside the <div> element with id="piechart"
		  var chart = new google.visualization.PieChart(document.getElementById('piechart_lokacije'));
		  chart.draw(data, options);

          // kovanci
		  my_array_coin = [['Kovanec', 'Znesek']];
		  for(var v=0; v<myValuteSum.length; v++) {
			  if (myValuteSum[v].vrednost > 500) {
			    my_item_coin = [myValuteSum[v].valuta, parseFloat(myValuteSum[v].vrednost)];
                //my_item_coin = [myValuteSum[v].valuta, parseFloat(myValuteSum[v].procent_port)];
	 		    my_array_coin.push(my_item_coin);
  			  }
		  }
		  var data_coin = google.visualization.arrayToDataTable(my_array_coin);
		  var options_coin = {'title':'Kovanci', 'width':530, 'height':300};
 		  var chart_coin = new google.visualization.PieChart(document.getElementById('piechart_kovanci'));
		  chart_coin.draw(data_coin, options_coin);
		}


        ////////////
        // alerts //
        ////////////
        //document.getElementById("alerts").innerHTML = 'Alarmi!<br/><br/>';
/*
        ////////////////////////
        // največje spremembe //
        ////////////////////////        
        var myTop1h = [];
        var myTop24h = [];
        var myTop7d = [];
        
        for(var j=0; j<data.length; j++) {
            var percent_change_1h  = parseFloat(data[j].percent_change_1h);
            var percent_change_24h = parseFloat(data[j].percent_change_24h);
            var percent_change_7d  = parseFloat(data[j].percent_change_7d);
            if (data[j].percent_change_1h == null) percent_change_1h = 0;
            if (data[j].percent_change_24h == null) percent_change_24h = 0;
            if (data[j].percent_change_7d == null) percent_change_7d = 0;
            myTop1h[myTop1h.length] = { symbol:             data[j].symbol,
                                        name:               data[j].name,
                                        price_eur:          parseFloat(data[j].price_eur),
                                        percent_change_1h:  percent_change_1h,
                                        percent_change_24h: percent_change_24h,
                                        percent_change_7d:  percent_change_7d
                                      };
            myTop24h[myTop24h.length] = { symbol:           data[j].symbol,
                                        name:               data[j].name,
                                        price_eur:          parseFloat(data[j].price_eur),
                                        percent_change_1h:  percent_change_1h,
                                        percent_change_24h: percent_change_24h,
                                        percent_change_7d:  percent_change_7d
                                      };
            myTop7d[myTop7d.length] = { symbol:             data[j].symbol,
                                        name:               data[j].name,
                                        price_eur:          parseFloat(data[j].price_eur),
                                        percent_change_1h:  percent_change_1h,
                                        percent_change_24h: percent_change_24h,
                                        percent_change_7d:  percent_change_7d
                                      };
        }    
        
        myTop1h.sort(function(a,b) {return (a.percent_change_1h < b.percent_change_1h) ? 1 : ((b.percent_change_1h < a.percent_change_1h) ? -1 : 0);} );  
        myTop24h.sort(function(a,b) {return (a.percent_change_24h < b.percent_change_24h) ? 1 : ((b.percent_change_24h < a.percent_change_24h) ? -1 : 0);} );  
        myTop7d.sort(function(a,b) {return (a.percent_change_7d < b.percent_change_7d) ? 1 : ((b.percent_change_7d < a.percent_change_7d) ? -1 : 0);} );  
        
        for(var r=0; r<10; r++) {
            // 1h
            //console.log(myTop1h[r].symbol+'-'+myTop1h[r].name+' = '+precise_round(myTop1h[r].percent_change_1h, 1)+'%');
            document.getElementById("top1h_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop1h[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                + myTop1h[r].symbol + '</a><br/><small>' + myTop1h[r].name + '</small>';
            document.getElementById("top1h_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].price_eur, 4) + ' €';
            document.getElementById("top1h_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top1h_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_24h, 1)+' %</small>';
            document.getElementById("top1h_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_7d, 1)+' %</small>';
            // 24h
            //console.log(myTop24h[r].symbol+'-'+myTop24h[r].name+' = '+precise_round(myTop24h[r].percent_change_24h, 1)+'%');
            document.getElementById("top24h_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop24h[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                 + myTop24h[r].symbol + '</a><br/><small>' + myTop24h[r].name + '</small>';
            document.getElementById("top24h_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].price_eur, 4) + ' €</small>';
            document.getElementById("top24h_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top24h_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_24h, 1)+' %</small>';
            document.getElementById("top24h_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_7d, 1)+' %</small>';
            // 7d
            //console.log(myTop7d[r].symbol+'-'+' = '+precise_round(myTop7d[r].percent_change_7d, 1)+'%   vrednost =' + precise_round(myTop7d[r].price_eur,4));
            document.getElementById("top7d_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop7d[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                + myTop7d[r].symbol + '</a><br/><small>' + myTop7d[r].name + '</small>';
            document.getElementById("top7d_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].price_eur, 4) + ' €</small>';
            document.getElementById("top7d_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top7d_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_24h, 1)+' %</small>';
            document.getElementById("top7d_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_7d, 1)+' %</small>';
        }
*/
        //
        // log
        //
        /*
                // izpiše moje valute
                console.log('--- Moje valute: ---');
                for(var v=0; v<myValute.length; v++) {
                    console.log(myValute[v].lokacija +'|'+ myValute[v].valuta +'|'+ myValute[v].tecaj +'€|'+
                                myValute[v].kolicina +'kom|'+ myValute[v].vrednost
                               );
                }
                // izpiše sum valut
                console.log('--- Sum valut: ---');
                for(var v=0; v<myValuteSum.length; v++) {
                    console.log(myValuteSum[v].valuta +'|'+ myValuteSum[v].tecaj +'€|'+
                                myValuteSum[v].kolicina +'kom|'+ myValuteSum[v].vrednost
                               );
                }
                
                // izpiši sumo sum
                console.log('--- Suma sum: ---');
                mySumDelta1h = mySumVrednost - mySumVrednost1h;
                mySumDelta24h = mySumVrednost - mySumVrednost24h;
                mySumDelta7d = mySumVrednost - mySumVrednost7d;
                mySumProcent1h = precise_round(100 * ((mySumVrednost / mySumVrednost1h) - 1), 1);
                mySumProcent24h = precise_round(100 * ((mySumVrednost / mySumVrednost24h) - 1), 1);
                mySumProcent7d = precise_round(100 * ((mySumVrednost / mySumVrednost7d) - 1), 1);
                mySumDelta1h = precise_round(mySumDelta1h, 0);
                mySumDelta24h = precise_round(mySumDelta24h, 0);
                mySumDelta7d = precise_round(mySumDelta7d, 0);
                console.log('Skupaj: ' + mySumVrednost);
                console.log('1h: ' + mySumDelta1h + '/' + mySumProcent1h);
                console.log('24h: ' + mySumDelta24h + '/' + mySumProcent24h);
                console.log('7d: ' + mySumDelta7d + '/' + mySumProcent7d);
       
        */
        console.log('Done');
        
        
    });
    promise.fail(function() {
      console.log('Fail');
      document.getElementById("sum_all").innerHTML = 'Ni podatkov';
    });
    promise.always(function() {
      //console.log('Allways='+tecaj);
    });
}





function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);   
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}


function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}


function getImgValuta(p_valuta) {
    var ime = '';
    if (p_valuta.toLowerCase() == 'usdt') ime = 'tether';
    if (p_valuta.toLowerCase() == 'btc') ime = 'bitcoin';
    if (p_valuta.toLowerCase() == 'eth') ime = 'ethereum';
    if (p_valuta.toLowerCase() == 'xrp') ime = 'ripple';
    if (p_valuta.toLowerCase() == 'ltc') ime = 'litecoin';
    if (p_valuta.toLowerCase() == 'algo') ime = 'algorand';
    if (p_valuta.toLowerCase() == 'sgb') ime = 'songbird';
    
    
    //if (p_valuta.toLowerCase() == 'miota') ime = 'iota';
    if (p_valuta.toLowerCase() == 'ada') ime = 'cardano';
    if (p_valuta.toLowerCase() == 'xlm') ime = 'stellar';
    if (p_valuta.toLowerCase() == 'neo') ime = 'neo';
    //if (p_valuta.toLowerCase() == 'powr') ime = 'power-ledger';
    if (p_valuta.toLowerCase() == 'xvg') ime = 'verge';
    if (p_valuta.toLowerCase() == 'eos') ime = 'eos';
    if (p_valuta.toLowerCase() == 'trx') ime = 'tron';
    //if (p_valuta.toLowerCase() == 'rdn') ime = 'raiden-network-token';
    //if (p_valuta.toLowerCase() == 'qsp') ime = 'quantstamp';
    //if (p_valuta.toLowerCase() == 'sub') ime = 'substratum';
    if (p_valuta.toLowerCase() == 'omg') ime = 'omg';
    //if (p_valuta.toLowerCase() == 'mth') ime = 'monetha';
    if (p_valuta.toLowerCase() == 'zrx') ime = '0x';
    if (p_valuta.toLowerCase() == 'enj') ime = 'enjin-coin';
    if (p_valuta.toLowerCase() == 'link') ime = 'chainlink';
    //if (p_valuta.toLowerCase() == 'lsk') ime = 'lisk';
    //if (p_valuta.toLowerCase() == 'wabi') ime = 'wabi';
    if (p_valuta.toLowerCase() == 'aave') ime = 'aave';
    //if (p_valuta.toLowerCase() == 'lun') ime = 'lunyr';
    //if (p_valuta.toLowerCase() == 'poe') ime = 'poet';
    //if (p_valuta.toLowerCase() == 'gto') ime = 'gifto';
    if (p_valuta.toLowerCase() == 'vet') ime = 'vechain';
    //if (p_valuta.toLowerCase() == 'icx') ime = 'icon';
    if (p_valuta.toLowerCase() == 'bnb') ime = 'binance-coin';
    if (p_valuta.toLowerCase() == 'bat') ime = 'basic-attention-token';
    //if (p_valuta.toLowerCase() == 'ark') ime = 'ark';
    if (p_valuta.toLowerCase() == 'nuls') ime = 'nuls';
    //if (p_valuta.toLowerCase() == 'waves') ime = 'waves';
    //if (p_valuta.toLowerCase() == 'vibe') ime = 'vibe';
    if (p_valuta.toLowerCase() == 'lrc') ime = 'loopring';
    if (p_valuta.toLowerCase() == 'zil') ime = 'zilliqa';
    //if (p_valuta.toLowerCase() == 'ont') ime = 'ontology';
    //if (p_valuta.toLowerCase() == 'wan') ime = 'wanchain';
    //if (p_valuta.toLowerCase() == 'bch') ime = 'bitcoin-cash';
    //if (p_valuta.toLowerCase() == 'bcha') ime = 'bitcoin-cash-abc-2';
    //if (p_valuta.toLowerCase() == 'bsv') ime = 'bitcoin-sv';
    //if (p_valuta.toLowerCase() == 'poly') ime = 'polymath-network';
    if (p_valuta.toLowerCase() == 'btt') ime = 'bittorrent';
    //if (p_valuta.toLowerCase() == 'dent') ime = 'dent';
    if (p_valuta.toLowerCase() == 'band') ime = 'band-protocol';
    if (p_valuta.toLowerCase() == 'kava') ime = 'kava';
    if (p_valuta.toLowerCase() == 'req') ime = 'request';
    if (p_valuta.toLowerCase() == 'sxp') ime = 'swipe';
    if (p_valuta.toLowerCase() == 'dot') ime = 'polkadot-new';
    if (p_valuta.toLowerCase() == 'bzrx') ime = 'bzx-protocol';
    if (p_valuta.toLowerCase() == 'dia') ime = 'dia';
    if (p_valuta.toLowerCase() == 'ksm') ime = 'kusama';
	if (p_valuta.toLowerCase() == 'vgx') ime = 'voyager-token';
	if (p_valuta.toLowerCase() == 'uni') ime = 'uniswap';
	if (p_valuta.toLowerCase() == 'rsr') ime = 'reserve-rights';
	if (p_valuta.toLowerCase() == '1inch') ime = '1inch';
	if (p_valuta.toLowerCase() == 'grt') ime = 'the-graph';
    if (p_valuta.toLowerCase() == 'doge') ime = 'dogecoin';
    if (p_valuta.toLowerCase() == 'pond') ime = 'marlin';
    if (p_valuta.toLowerCase() == 'hot') ime = 'holo';
    if (p_valuta.toLowerCase() == 'troy') ime = 'troy';
    if (p_valuta.toLowerCase() == 'mft') ime = 'mainframe';
    if (p_valuta.toLowerCase() == 'reef') ime = 'reef';
    if (p_valuta.toLowerCase() == 'ckb') ime = 'nervos-network';
    if (p_valuta.toLowerCase() == 'npxs') ime = 'pundix-new';
    if (p_valuta.toLowerCase() == 'ncash') ime = 'nucleus-vision';
    if (p_valuta.toLowerCase() == 'lto') ime = 'lto-network';
    if (p_valuta.toLowerCase() == 'avax') ime = 'avalanche';
    if (p_valuta.toLowerCase() == 'ramp') ime = 'ramp';
    if (p_valuta.toLowerCase() == 'matic') ime = 'polygon';
    if (p_valuta.toLowerCase() == 'shib') ime = 'shiba-inu';
    if (p_valuta.toLowerCase() == 'hnt') ime = 'helium';
    if (p_valuta.toLowerCase() == 'sol') ime = 'solana';
    if (p_valuta.toLowerCase() == 'luna') ime = 'terra-luna';
    if (p_valuta.toLowerCase() == 'mina') ime = 'mina';
    if (p_valuta.toLowerCase() == 'ftm') ime = 'fantom'; // preimenovano v sonic
    if (p_valuta.toLowerCase() == 's') ime = 'sonic';
    if (p_valuta.toLowerCase() == 'axs') ime = 'axie-infinity';
    if (p_valuta.toLowerCase() == 'ar') ime = 'arweave';
    if (p_valuta.toLowerCase() == 'sand') ime = 'the-sandbox';
    if (p_valuta.toLowerCase() == 'mana') ime = 'decentraland';
    if (p_valuta.toLowerCase() == 'ilv') ime = 'illuvium';
    if (p_valuta.toLowerCase() == 'tvk') ime = 'terra-virtua-kolect';
    if (p_valuta.toLowerCase() == 'gala') ime = 'gala';
    if (p_valuta.toLowerCase() == 'glmr') ime = 'moonbeam';
    if (p_valuta.toLowerCase() == 'movr') ime = 'moonriver';
    if (p_valuta.toLowerCase() == 'flr') ime = 'flare';
    if (p_valuta.toLowerCase() == 'fet') ime = 'fetch';
    if (p_valuta.toLowerCase() == 'agix') ime = 'singularitynet';
    if (p_valuta.toLowerCase() == 'ctxc') ime = 'cortex';
    if (p_valuta.toLowerCase() == 'algo') ime = 'algorand';
    if (p_valuta.toLowerCase() == 'arb') ime = 'arbitrum';
    if (p_valuta.toLowerCase() == 'wif') ime = 'dogwifhat';

    // bnb loaunchpool
    if (p_valuta.toLowerCase() == 'cyber') ime = 'cyberconnect';
    if (p_valuta.toLowerCase() == 'sei') ime = 'sei';
    if (p_valuta.toLowerCase() == 'meme') ime = 'meme';
    if (p_valuta.toLowerCase() == 'ace') ime = 'fusionist';
    if (p_valuta.toLowerCase() == 'nfp') ime = 'nfprompt';
    if (p_valuta.toLowerCase() == 'ai') ime = 'sleepless-ai';
    if (p_valuta.toLowerCase() == 'xai') ime = 'xai-games';
    if (p_valuta.toLowerCase() == 'manta') ime = 'manta-network';
    if (p_valuta.toLowerCase() == 'alt') ime = 'altlayer';
    if (p_valuta.toLowerCase() == 'sui') ime = 'sui';
    if (p_valuta.toLowerCase() == 'vanry') ime = 'vanar';
    if (p_valuta.toLowerCase() == 'pixel') ime = 'pixel';
    if (p_valuta.toLowerCase() == 'portal') ime = 'portal-gaming';
    if (p_valuta.toLowerCase() == 'aevo') ime = 'aevo';
    if (p_valuta.toLowerCase() == 'ethfi') ime = 'ether-fi-ethfi';
    if (p_valuta.toLowerCase() == 'ena') ime = 'ethena';

    //if (p_valuta.toLowerCase() == 'bcx') ime = 'bitcoinx';
    //if (p_valuta.toLowerCase() == 'sbtc') ime = 'super-bitcoin';

    //if (p_valuta.toLowerCase() == 'dbix') ime = 'dubaicoin-dbix';
    //if (p_valuta.toLowerCase() == 'etn') ime = 'electroneum';
    //if (p_valuta.toLowerCase() == 'emb') ime = 'embercoin';
    //if (p_valuta.toLowerCase() == 'piggy') ime = 'piggycoin';
    //if (p_valuta.toLowerCase() == 'toa') ime = 'toacoin';
    //if (p_valuta.toLowerCase() == 'xgox') ime = 'xgox';
    
    //if (p_valuta.toLowerCase() == 'acc') ime = 'adcoin';
    if (p_valuta.toLowerCase() == 'kcs') ime = 'kucoin-token';
    //if (p_valuta.toLowerCase() == 'can') ime = 'canyacoin';
    //if (p_valuta.toLowerCase() == 'xas') ime = 'asch';
    //if (p_valuta.toLowerCase() == 'qlc') ime = 'qlink';
    //if (p_valuta.toLowerCase() == 'ugk') ime = 'unikoin-gold';
    //if (p_valuta.toLowerCase() == 'nano') ime = 'nano';
    //if (p_valuta.toLowerCase() == 'pay') ime = 'tenx';
    //if (p_valuta.toLowerCase() == 'nas') ime = 'nebulas-token';
    //if (p_valuta.toLowerCase() == 'theta') ime = 'theta-token';
    //if (p_valuta.toLowerCase() == 'dat') ime = 'datum';
    if (p_valuta.toLowerCase() == 'xyo') ime = 'xyo';
    if (p_valuta.toLowerCase() == 'skey') ime = 'smartkey';
    if (p_valuta.toLowerCase() == 'ubx') ime = 'ubix-network';
    if (p_valuta.toLowerCase() == 'theta') ime = 'theta-token';
    
    if (p_valuta.toLowerCase() == 'bepro') ime = 'bepro-network';
    if (p_valuta.toLowerCase() == 'lyxe') ime = 'lukso';
    if (p_valuta.toLowerCase() == 'dreams') ime = 'dreams-quest';
    if (p_valuta.toLowerCase() == 'kda') ime = 'kadena';
    if (p_valuta.toLowerCase() == 'hero') ime = 'metahero';
    if (p_valuta.toLowerCase() == 'naka') ime = 'nakamoto-games';
    
    if (p_valuta.toLowerCase() == 'cro') ime = 'crypto-com-coin';
    if (p_valuta.toLowerCase() == 'wild') ime = 'wilder-world';
    if (p_valuta.toLowerCase() == 'shil') ime = 'project-seed';
    if (p_valuta.toLowerCase() == 'rfox') ime = 'redfox-labs';
    if (p_valuta.toLowerCase() == 'cwar') ime = 'cryowar';
    if (p_valuta.toLowerCase() == 'blok') ime = 'bloktopia';
    if (p_valuta.toLowerCase() == 'vlx') ime = 'velas';
    if (p_valuta.toLowerCase() == 'vxv') ime = 'vectorspace-ai';
    if (p_valuta.toLowerCase() == 'kas') ime = 'kaspa';

    if (p_valuta.toLowerCase() == 'pyth') ime = 'pyth-network';
    if (p_valuta.toLowerCase() == 'bonk') ime = 'bonk1';
    
    // mexc
    if (p_valuta.toLowerCase() == 'nos') ime = 'nosana';
    if (p_valuta.toLowerCase() == 'peng') ime = 'peng-sol';
    if (p_valuta.toLowerCase() == 'grok') ime = 'grok-erc';
    if (p_valuta.toLowerCase() == 'blub') ime = 'blub';
   
    //if (p_valuta.toLowerCase() == 'blx') ime = 'blockchain-index';
    
    return '<a href="https://coinmarketcap.com/currencies/' + ime + '">' + 
           '<img src="img/coin/' + p_valuta.toLowerCase() + '.png" height="16" width="16"></a>&nbsp;';
}


function getImgLokacija(p_valuta, p_size=32) {
    if (p_valuta.toLowerCase() == 'bitstamp') {
        return '<a href="https://www.bitstamp.net">' + 
               '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>' +
               '&nbsp;';
    }
    else if (p_valuta.toLowerCase() == 'ledger nano s') {
        return '<a href="https://www.ledgerwallet.com/products/ledger-nano-s">' + 
               '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>' +
               '&nbsp;';
    }
    else if (p_valuta.toLowerCase() == 'binance') {
        return '<a href="https://www.binance.com">' + 
               '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>' +
               '&nbsp;';
    }
    else if (p_valuta.toLowerCase() == 'cryptopia') {
        return '<a href="https://www.cryptopia.co.nz">' + 
               '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>' +
               '&nbsp;';
    }
    else if (p_valuta.toLowerCase() == 'iconomi') {
        return '<a href="https://www.iconomi.net/dashboard/#/">' + 
               '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>' +
               '&nbsp;';
    }    
    else {
        return '<img src="img/wallet/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="'+p_size+'" width="'+p_size+'"></a>&nbsp;';
    }
}

function compare_for_sort_desc(a, b) {
    if ( parseFloat(a.vrednost) < parseFloat(b.vrednost) ){return 1;}
    if ( parseFloat(a.vrednost) > parseFloat(b.vrednost) ){return -1;}
    return 0;
}
