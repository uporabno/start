function pridobiPodatke() {
    // alternative.me ticker via cors.io proxy (brez API kljuca)
    var url = 'https://cors.io/?url=https://api.alternative.me/v1/ticker/?convert=EUR&limit=0';
    console.log('Start');
    var promise = $.getJSON(url);
    promise.done(function(response) {
        var data = JSON.parse(response.body); // cors.io ovija odgovor v {url,status,headers,body}
        var binanceArr = [
            'ADA',   'ADX',   'AION',  'AMB',   'ARK',   'ARN',   'AST',   'BAT',   'BCC',   'BCD',
            'BCPT',  'BNB',   'BNT',   'BQX',   'BTC',   'BTG',   'BTS',   'CDT',   'CMT',   'CND',
            'CTR',   'DASH',  'DGD',   'DLT',   'DNT',   'ELF',   'ENG',   'ENJ',   'EOS',   'ETC',
            'ETH',   'EVX',   'FUEL',  'FUN',   'GAS',   'GTO',   'GVT',   'GXS',   'HSR',   'ICN',
            'ICX',   'IOTA',  'KMD',   'KNC',   'LEND',  'LINK',  'LRC',   'LSK',   'LTC',   'MANA',
            'MCO',   'MDA',   'MOD',   'MTH',   'MTL',   'NEO',   'NULS',  'OAX',   'OMG',   'OST',
            'POE',   'POWR',  'PPT',   'QSP',   'QTUM',  'RCN',   'RDN',   'REQ',   'SALT',  'SNGLS',
            'SNM',   'SNT',   'STORJ', 'STRAT', 'SUB',   'TNB',   'TNT',   'TRX',   'VEN',   'VIB',
            'WABI',  'WAVES', 'WTC',   'XLM',   'XMR',   'XRP',   'XVG',   'XZC',   'YOYO',  'ZEC',
            'ZRX'];
        var myTop1h = [];
        var myTop24h = [];
        var myTop7d = [];

        for(var j=0; j<data.length; j++) {
            var percent_change_1h  = parseFloat(data[j].percent_change_1h)  || 0;
            var percent_change_24h = parseFloat(data[j].percent_change_24h) || 0;
            var percent_change_7d  = parseFloat(data[j].percent_change_7d)  || 0;
            var x24h_volume_eur    = parseFloat(data[j]["24h_volume_usd"]) * 0.88 || 0; // USD*0.88=EUR
            x24h_volume_eur = precise_round(x24h_volume_eur, 0);
            var price_eur = parseFloat(data[j].price_usd) * 0.88; // price_eur iz API-ja je napacen (14.07.2026)
            var item = { symbol: data[j].symbol, name: data[j].name, price_eur: price_eur,
                         percent_change_1h: percent_change_1h, percent_change_24h: percent_change_24h,
                         percent_change_7d: percent_change_7d, x24h_volume_eur: x24h_volume_eur };
            myTop1h.push(item);
            myTop24h.push(item);
            myTop7d.push(item);
        }

        myTop1h.sort(function(a,b) { return b.percent_change_1h  - a.percent_change_1h;  });
        myTop24h.sort(function(a,b){ return b.percent_change_24h - a.percent_change_24h; });
        myTop7d.sort(function(a,b) { return b.percent_change_7d  - a.percent_change_7d;  });

        for(var r=0; r<100; r++) {
            var volColor1h  = myTop1h[r].x24h_volume_eur  >= 100000 ? 'green' : 'silver';
            var volColor24h = myTop24h[r].x24h_volume_eur >= 100000 ? 'green' : 'silver';
            var volColor7d  = myTop7d[r].x24h_volume_eur  >= 100000 ? 'green' : 'silver';
            // 1h
            document.getElementById("top1h_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop1h[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                + myTop1h[r].symbol + '</a><br/><small>' + myTop1h[r].name + '</small>';
            if (binanceArr.indexOf(myTop1h[r].symbol) > -1) {
                document.getElementById("top1h_valuta_v" + r).innerHTML += '<font color="red">@Binance</font>';
            }
            if (myTop1h[r].x24h_volume_eur >= 100000) {
                document.getElementById("top1h_valuta_v" + r).innerHTML += '<font color="green"><br/>' + numberWithCommas(myTop1h[r].x24h_volume_eur) + ' \u20ac</font>';
            } else {
                document.getElementById("top1h_valuta_v" + r).innerHTML += '<font color="silver"><br/>' + numberWithCommas(myTop1h[r].x24h_volume_eur) + ' \u20ac</font>';
            }
            document.getElementById("top1h_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].price_eur, 4) + ' \u20ac</small>';
            document.getElementById("top1h_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top1h_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_24h, 1)+' %</small>';
            document.getElementById("top1h_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop1h[r].percent_change_7d, 1)+' %</small>';
            // 24h
            document.getElementById("top24h_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop24h[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                 + myTop24h[r].symbol + '</a><br/><small>' + myTop24h[r].name + '</small>';
            if (binanceArr.indexOf(myTop24h[r].symbol) > -1) {
                document.getElementById("top24h_valuta_v" + r).innerHTML += '<font color="red">@Binance</font>';
            }
            if (myTop24h[r].x24h_volume_eur >= 100000) {
                document.getElementById("top24h_valuta_v" + r).innerHTML += '<font color="green"><br/>' + numberWithCommas(myTop24h[r].x24h_volume_eur) + ' \u20ac</font>';
            } else {
                document.getElementById("top24h_valuta_v" + r).innerHTML += '<font color="silver"><br/>' + numberWithCommas(myTop24h[r].x24h_volume_eur) + ' \u20ac</font>';
            }
            document.getElementById("top24h_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].price_eur, 4) + ' \u20ac</small>';
            document.getElementById("top24h_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top24h_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_24h, 1)+' %</small>';
            document.getElementById("top24h_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop24h[r].percent_change_7d, 1)+' %</small>';
            // 7d
            document.getElementById("top7d_valuta_v" + r).innerHTML = '<a href="https://www.google.si/search?q='+ myTop7d[r].symbol +'+site:coinmarketcap.com" target="_blank">'
                                                                                + myTop7d[r].symbol + '</a><br/><small>' + myTop7d[r].name + '</small>';
            if (binanceArr.indexOf(myTop7d[r].symbol) > -1) {
                document.getElementById("top7d_valuta_v" + r).innerHTML += '<font color="red">@Binance</font>';
            }
            if (myTop7d[r].x24h_volume_eur >= 100000) {
                document.getElementById("top7d_valuta_v" + r).innerHTML += '<font color="green"><br/>' + numberWithCommas(myTop7d[r].x24h_volume_eur) + ' \u20ac</font>';
            } else {
                document.getElementById("top7d_valuta_v" + r).innerHTML += '<font color="silver"><br/>' + numberWithCommas(myTop7d[r].x24h_volume_eur) + ' \u20ac</font>';
            }
            document.getElementById("top7d_tecaj_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].price_eur, 4) + ' \u20ac</small>';
            document.getElementById("top7d_spr1h_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_1h, 1)+' %</small>';
            document.getElementById("top7d_spr24h_v" + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_7d, 1)+' %</small>';
            document.getElementById("top7d_spr7d_v"  + r).innerHTML = '<small>' + precise_round(myTop7d[r].percent_change_7d, 1)+' %</small>';
        }
        console.log('Done');
    });
    promise.fail(function() { console.log('Fail'); });
}

function precise_round(num, decimals) {
   var t = Math.pow(10, decimals);
   return (Math.round((num * t) + (decimals>0?1:0)*(Math.sign(num) * (10 / Math.pow(100, decimals)))) / t).toFixed(decimals);
}

function numberWithCommas(n) {
    var parts=n.toString().split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

function getImgLokacija(p_valuta) {
    return '<img src="img/' + p_valuta.toLowerCase() + '.png" class="img-circle" height="32" width="32">&nbsp;';
}
