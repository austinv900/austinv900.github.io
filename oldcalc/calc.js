const pay = {
	calculate(solo, revenue, mileage, weight, stops, breaks) {
		var r = 0.00;
		
		if (solo) {
			r += this.soloRevenue * revenue;
			r += this.soloMileage * mileage;
			r += this.soloWeight * weight;
			r += this.soloStops * stops;
			r += this.soloRests * breaks;
		} else {
			r += this.teamRevenue * revenue;
			r += this.teamMileage * mileage;
			r += this.teamWeight * weight;
			r += this.teamStops * stops;
			r += this.teamRests * breaks;
		}
		
		return r;
	}
}

function PayCalculator(solorev, teamrev, solomil, teammil, soloweight, teamweight, solostops, teamstops, soloR, teamR) {
	this.soloRevenue = solorev;
	this.teamRevenue = teamrev;
	this.soloMileage = solomil;
	this.teamMileage = teammil;
	this.soloWeight = soloweight;
	this.teamWeight = teamweight;
	this.soloStops = solostops;
	this.teamStops = teamstops;
	this.soloRests = soloR;
	this.teamRests = teamR;
}

PayCalculator.prototype = pay;
PayCalculator.prototype.constructor = PayCalculator;

const payVals = [
	[
		new PayCalculator(0.000857, 0.000643, 0.443115, 0.280768, 0.010026, 0.006905, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.000857, 0.000650, 0.404758, 0.268451, 0.012997, 0.008625, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.000750, 0.000750, 0.255320, 0.255320, 0.009019, 0.009019, 6.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.000865, 0.000865, 0.255320, 0.255320, 0.009019, 0.009019, 6.00, 6.00, 3.99, 3.99)
	],
	[
		// TODO: Need to fix team revenue for this value;
		new PayCalculator(0.000994, 0.000994, 0.435480, 0.285572, 0.010299, 0.007726, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001215, 0.000880, 0.385446, 0.282118, 0.013267, 0.009793, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.000890, 0.000890, 0.274278, 0.274278, 0.009697, 0.009697, 6.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001100, 0.001100, 0.281925, 0.281925, 0.012313, 0.012313, 6.00, 6.00, 3.99, 3.99)
	],
	[
		new PayCalculator(0.001003, 0.000659, 0.455543, 0.295655, 0.010678, 0.008357, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001251, 0.000884, 0.404708, 0.290231, 0.014638, 0.010447, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.000894, 0.000894, 0.282153, 0.282153, 0.010608, 0.010608, 6.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001104, 0.001104, 0.290000, 0.290000, 0.014116, 0.014116, 6.00, 6.00, 3.99, 3.99)
	],
	[
		new PayCalculator(0.001000, 0.000669, 0.437455, 0.292001, 0.010739, 0.009117, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.400764, 0.001000, 0.400764, 0.293202, 0.014851, 0.011208, 8.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001005, 0.001005, 0.281845, 0.281845, 0.011894, 0.011894, 6.00, 6.00, 3.99, 3.99),
		new PayCalculator(0.001320, 0.001320, 0.306797, 0.306797, 0.014851, 0.014851, 6.00, 6.00, 3.99, 3.99)
	]
];

function clampMileage(mileage) {
	var v = 3;
	
	if (mileage < 1001) {
		v = 2;
	}
	
	if (mileage < 551) {
		v = 1;
	}
	
	if (mileage < 301) {
		v = 0;
	}
	
	return v;
}

function getValueOrDefault(value, def) {
	if (value == null || value == NaN || value == '') {
		return def;
	}
	
	return value;
}

function calculate() {
	var yearsSelect = document.getElementById("Years");
	
	var years = getValueOrDefault(yearsSelect.options[yearsSelect.selectedIndex].value, 0);
	var solo = getValueOrDefault(document.getElementById("Solo").checked, false);
	var trainer = getValueOrDefault(document.getElementById("Trainer").checked, false);
	var layover = getValueOrDefault(document.getElementById("Layover").value, 0);
	var revenue = getValueOrDefault(document.getElementById("Revenue").value, 0);
	var mileage = getValueOrDefault(document.getElementById("Mileage").value, 0);
	var weight = getValueOrDefault(document.getElementById("Weight").value, 0);
	var stops = getValueOrDefault(document.getElementById("Stops").value, 0);
	var breaks = getValueOrDefault(document.getElementById("Breaks").value, 0);
	
	var mileageSelect = clampMileage(mileage);
	
	var pay = payVals[years][clampMileage(mileage)].calculate(solo, revenue, mileage, weight, stops, breaks);
	
	if (trainer) {
		pay += 50;
	}
	
	if (layover > 0) {
		pay += (150 * layover);
	}
	
	pay = Math.round((pay + Number.EPSILON) * 100) / 100;
	
	console.log(`Years of service: ${years}\n` +
	`Revenue: ${revenue}\n` +
	`Mileage: ${mileage}\n` +
	`Weight: ${weight}\n` +
	`Stops: ${stops}\n` +
	`Breaks: ${breaks}\n` +
	`Solo: ${solo}\n` +
	`Trainer: ${trainer}\n` +
	`Layovers: ${layover}\n` +
	'-----------------------------\n' +
	'Estimated Payout: $' + pay);
	
	document.getElementById("Payout").innerText = '$' + pay;
	save('Payout', pay);
}

function save(key, value) {
	console.log(`Saved KeyValuePair: [${key}, ${value}]`);
	localStorage.setItem(key, value);
}

function load() {
	if (localStorage.Years) {
		document.getElementById("Years").value = localStorage.Years;
	}
	
	if (localStorage.Solo) {
		document.getElementById("Solo").checked = Boolean(localStorage.Solo);
		
		if (localStorage.Mileage) {
			if (localStorage.Mileage > 550) {
				document.getElementById("Solo").disabled = true;
				document.getElementById("Solo").checked = false;
			} else {
				document.getElementById("Solo").disabled = false;
			}
		}
	}
	
	if (localStorage.Trainer) {
		document.getElementById("Trainer").checked = Boolean(localStorage.Trainer);
	}
	
	if (localStorage.Layover) {
		document.getElementById("Layover").value = Number(localStorage.Layover);
	}
	
	if (localStorage.Revenue) {
		document.getElementById("Revenue").value = Number(localStorage.Revenue);
	}
	
	if (localStorage.Mileage) {
		document.getElementById("Mileage").value = Number(localStorage.Mileage);
	}
	
	if (localStorage.Weight) {
		document.getElementById("Weight").value = Number(localStorage.Weight);
	}
	
	if (localStorage.Stops) {
		document.getElementById("Stops").value = Number(localStorage.Stops);
	}
	
	if (localStorage.Breaks) {
		document.getElementById("Breaks").value = Number(localStorage.Breaks);
	}
	
	if (localStorage.Payout) {
		document.getElementById("Payout").innerText = '$' + Number(localStorage.Payout);
	}
}

function clearCache() {
	localStorage.clear();
	location.reload();
}

function onChange() {
	var id = this.id;
	var val = $(this).val();
	
	if (this.type != undefined && this.type != null) {
		if (this.type == 'checkbox') {
			val = this.checked;
		}
	}
	
	if (id == 'Mileage') {
		if (val > 550) {
			document.getElementById("Solo").disabled = true;
			document.getElementById("Solo").checked = false;
			
		} else {
			document.getElementById("Solo").disabled = false;
		}
	}
	
	save(id, val);
}

$(document).ready(function() {
	load();
	$('select').change(onChange);
	$('input').change(onChange);
})