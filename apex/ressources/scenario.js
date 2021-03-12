/* 
Changelog
	-	25/01/2021 ajout de add_header() qui est l'évolution de add_groupe_colonne()
	-	12/03/2021
		-	mise à jour de add_header() pour choisir entre thead/tbody
		-	Indentation du code
*/   
function export_excel(ID_REPORT, NM_PAGE, ID_APP, ID_SESSION) {

    try {
        var clob_ob = new apex.ajax.clob(
            function() {
                var rs = p.readyState
                if (rs == 1 || rs == 2 || rs == 3) {

                } else if (rs == 4) {

                    //        $(location).attr('href','f?p='+ ID_APP + ':' + NM_PAGE + ':' + ID_SESSION + '::NO');
                    window.location.href = 'f?p=' + ID_APP + ':' + NM_PAGE + ':' + ID_SESSION + '::NO';
                } else {
                    return false;
                }
            }
        );


        var $clonedTable = $('#' + ID_REPORT).clone();
        $clonedTable.find('[style*="display: none"]').remove();
        $clonedTable.find('[class*="no-displayFiltre"]').remove();
        $clonedTable.find('[class*="dtt_collapsed_tr"]').remove();
        var html = $clonedTable[0].outerHTML;

        clob_ob._set(html);

    } catch (err) {

        alert(err);

    }
}

// AFFICHAGE REGION RECHERCHE AFTER REFRESH

function refresh_search(ID_ELT, ID_REGION) {
    try {

        var v_nodelt = $('#' + ID_ELT);
        var v_elt = $('#' + ID_ELT).val();
        var v_region = $('#' + ID_REGION);

        v_nodelt.hide();

        if (v_elt == 1) {
            v_region.hide();
        }


        if (v_elt == 0) {
            v_region.show();
        }
    } catch (err) {
        alert(err);
    }


}

// TOGGLE REGION RECHERCHE 

function toggle_search(ID_ELT, ID_REGION) {
    try {

        var v_nodelt = $('#' + ID_ELT);
        var v_elt = $('#' + ID_ELT).val();
        var v_region = $('#' + ID_REGION);
        var v_value = 0;

        if (v_elt == 0) {
            v_region.hide();
            v_value = 1;
        } else {
            v_region.show();
            v_value = 0;
        }

        v_nodelt.val(v_value);


    } catch (err) {
        alert(err);
    }


}




function conserver_position(ID_REPORT) {

    try {

        var pageId = $('[name=p_flow_step_id]').first().val();
        var pos = sessionStorage.getItem('scrollPosition' + pageId);

        $("html, body").animate({
            scrollTop: pos
        }, 1);
        sessionStorage.removeItem('scrollPosition' + pageId);

        $(document).ready(function() {

            $('#' + ID_REPORT + ' tbody tr td  a').click(function(e) {
                var pageId = $('[name=p_flow_step_id]').first().val();
                sessionStorage.setItem('scrollPosition' + pageId, $(window).scrollTop());
            });


        });

    } catch (err) {
        alert(err);

    }
}


// Transforme une donnée numérique vers le format numérique anglais pour faire des calculs
function formatNum(val, langue) {
    switch (langue) {
        case "fr":
            var valeur = +val.replace(/ /g, '').replace(',', '.');
            break;
        case "en":
            var valeur = +val.replace(/,/g, '');
            break;
        case "es":
            var valeur = +val.replace(/\./g, '').replace(',', '.');
            break;
        default:
            var valeur = +val.replace(/ /g, '').replace(',', '.');
            break;
    }
    return valeur;
}



// Met en forme un nombre numérique de format anglais sous la forme souhaité dépendamment du format de la langue
// formate un chiffre avec 'decimal' chiffres après la virgule et un separateur
function formatFinal(valeur, decimal, langue) {
    var separa = '#';

    switch (langue) {
        case "fr":
            var sepdec = ',';
            var sepmil = ' ';
            break;
        case "en":
            var sepdec = '.';
            var sepmil = ',';
            break;
        case "es":
            var sepdec = ',';
            var sepmil = '.';
            break;
        default:
            var sepdec = ',';
            var sepmil = ' ';
            break;
    }


    var deci = Math.round(Math.pow(10, decimal) * (Math.abs(valeur) - Math.floor(Math.abs(valeur))));
    var val = Math.floor(Math.abs(valeur));
    if ((decimal == 0) || (deci == Math.pow(10, decimal))) {
        val = Math.floor(Math.abs(valeur));
        deci = 0;
    }
    var val_format = val + "";
    var nb = val_format.length;
    for (var i = 1; i < 4; i++) {
        if (val >= Math.pow(10, (3 * i))) {
            val_format = val_format.substring(0, nb - (3 * i)) + separa + val_format.substring(nb - (3 * i));
        }
    }
    if (decimal > 0) {
        var decim = "";
        for (var j = 0; j < (decimal - deci.toString().length); j++) {
            decim += "0";
        }
        deci = decim + deci.toString();
        val_format = val_format + "." + deci;
    }
    if (parseFloat(valeur) < 0) {
        val_format = "-" + val_format;
    }

    return String(val_format).replace('.', sepdec).replace(/#/g, sepmil);
}




function formatage_ligne(NOM_COL, VAL_COL, NOM_CLASS, ID_REPORT) {

    $("#" + ID_REPORT + " tbody tr td").each(function() {
        if ($(this).attr('headers') == NOM_COL) {

            var val_cellule = $(this).text().trim();

            if (val_cellule == VAL_COL) {

                $(this).parent().children().addClass(NOM_CLASS);
                $(this).parent().children().find('a').addClass(NOM_CLASS);
            }

        }
    });

}



function cacher_colonne(NOM_COL, ID_REPORT) {
    $('#' + NOM_COL).css('display', 'none');

    $("#" + ID_REPORT + " tbody tr td").find("[headers=" + NOM_COL + "]").css('display', 'none');

}



function format_colonne(NOM_COL, NOM_CLASS, ID_REPORT) {
    $('#' + ID_REPORT + ' tbody tr td [headers=' + NOM_COL + '] a').addClass(NOM_CLASS);
    $('#' + ID_REPORT + ' tbody tr td [headers=' + NOM_COL + '] ').addClass(NOM_CLASS);

}



//Obsolète, ne plus utiliser pour nouveaux projets
function add_groupe_colonne(NUMERO_COL, NOM_GROUPE, COL_SPAN, ID_REPORT) {
    if (NUMERO_COL == 1) $("<TR> <TH class='t-Report-colHead'> &nbsp </TH></TR> ").insertBefore("#" + ID_REPORT + " .t-Report-report tbody tr:first");
    else $("<TH class='t-Report-colHead' colspan='" + COL_SPAN + "'> " + NOM_GROUPE + " </TH>").insertAfter("#" + ID_REPORT + " .t-Report-report tbody tr:first TH:last");
}

//En remplacement de add_groupe_colonne >
//Paramètres : id = static id du tableau | span = largeur en nb de colonnes | txt = texte dans la colonne | n = nom ou nb du groupe de valeur | style = Css à appliquer | target = emplacement (tbody/thead)
function add_header(id, span, txt = '', n = 1, style = '', target = 'tbody') {
    if ($('#header_' + id + '_' + n).length == 0) {
        if ($('#report_' + id + ' > div > div > table > ' + target).length != 0) {
            $('#report_' + id + ' > div > div > table > ' + target).prepend('<tr id="header_' + id + '_' + n + '"></tr>');
        } else {
            console.log('Élément report_' + id + ' introuvable')
        }
    }
    $('#report_' + id + ' > div > div > table > ' + target + ' > tr#header_' + id + '_' + n).append('<th colspan="' + span + '" style="' + style + '" class="t-Report-colHead">' + txt + '</th>');
}


//LPad(a,4,"0") will return 000a
function lpad(pVal, pLength, pChar) {
    if (!pVal)
        return ("");

    if (!pLength)
        return (pVal);

    if (!pChar)
        return (pVal);

    var pNewVal = pVal.toString();
    while (pNewVal.length < pLength)
        pNewVal = pChar + pNewVal;

    return (pNewVal);
}



// Grille de Saisie
//renseigne les valeurs sur l'ancien tabular form
function set_data(prow, pcol, pvalue, pnbdec, plang) {
    var vCurrRow2 = lpad(prow, 4, '0');
    var vCol2 = 'f' + lpad(pcol, 2, '0');
    var vNbdec = pnbdec;
    var vLang2 = plang;
    var p_value2 = pvalue;

    if (p_value2 != '' && p_value2 != null && isNaN(pvalue) == false)
        p_value2 = formatFinal(p_value2, vNbdec, vLang2);

    $('#' + vCol2 + "_" + vCurrRow2).val(p_value2);

}



// Remplit la grille de saisie à partir des colonnes id fii_xxxx
function insert_data(pdata1, prow, pcol, plang) {

    for (var row = 1; row <= prow; row++) {
        var vCurrRow2 = lpad(row, 4, '0');
        var data1_col = [];

        for (var col = 1; col <= pcol; col++) {
            var vCol2 = 'f' + lpad(col, 2, '0');
            var val_form = $('#' + vCol2 + "_" + vCurrRow2).val();

            if (!val_form == '') {
                if (isNaN(formatNum(val_form, plang)))
                    data1_col[col - 1] = val_form;
                else
                    data1_col[col - 1] = formatNum(val_form, plang);
            }
        }

        pdata1[row - 1] = data1_col;
    };

}