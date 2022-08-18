const uuid = require('uuid');

const resource = require('../model/data');
const list = 'list'
	, optionArea = 'option_area'
	, optionSize = 'option_size';

const lib = {

	getAllByRange: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		const hmax = req.query.hmax ? req.query.hmax : 100000;
		const hmin = req.query.hmin ? req.query.hmin : 0;
		const smax = req.query.smax ? req.query.smax : 10000;
		const smin = req.query.smin ? req.query.smin : 0;
		// const tmax = req.query.tmax ? req.query.tmax : new Date();
		// const tmin = req.query.tmin ? req.query.tmin : 0;

		let rawData = await resource.searchResource(list)
		// let rawData = await storeList.read(list, { limit: 20 })
		// let rawData = [
		// 	{"uuid":null,"komoditas":null,"area_provinsi":null,"area_kota":null,"size":null,"price":null,"tgl_parsed":null,"timestamp":null}
		// 	,{"uuid":"dd09261d-5e09-4fcb-a2cc-9b2251414cdc","komoditas":"PATIN","area_provinsi":"JAWA BARAT","area_kota":"DEPOK","size":"180","price":"25000","tgl_parsed":"2022-01-04T23:15:44Z","timestamp":"1641338144818"}
		// 	,{"uuid": "7b91e96d-1903-4e67-89e5-c8e42d31bdd1","komoditas": "BAWAL","area_provinsi": "JAWA TENGAH","area_kota": "PURWOREJO","size": "160","price": "3000000","tgl_parsed": "2022-01-01T17:51:11Z","timestamp": "1641059471470"}
		// 	,{"uuid": "7b91e96d-1903-4e67-89e5-c8e42d31bdd1","komoditas": "BAWAL","area_provinsi": "JAWA TENGAH","area_kota": "PURWOREJO","size": "160","price": "4500","tgl_parsed": "2022-01-01T17:51:11Z","timestamp": "1641059471470"}
		// ]

		rawData.forEach(element => {

			if (
				element.uuid &&
				(hmin <= parseInt(element.price) && parseInt(element.price) <= hmax) &&
				(smin <= parseInt(element.size) && parseInt(element.size) <= smax)
			) {
				result.data.push(element)
			}

		});

		if (!result.data.length) {
			result.message = 'Data tidak ditemukan'
		} else {
			result.code = '00'
			result.message = 'List data'
		}

		res.send(result)

	},

	getAllByCommodity: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		const commodity = req.params.commodity.toUpperCase();


		let rawData = await resource.searchResource(list, { search: { komoditas: commodity } });

		// console.log(rawData);

		if (!rawData.length) {
			result.message = 'data tidak ditemukan';
		} else {
			result = {
				code: '00',
				message: 'List data',
				data: rawData
			};
		}

		res.send(result);

	},

	getAllById: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		const id = req.params.id;

		let rawData = await resource.searchResource(list, { search: { uuid: id } });

		// console.log(rawData);

		if (!rawData.length) {
			result.message = 'data tidak ditemukan';
		} else {
			result = {
				code: '00',
				message: 'List data',
				data: rawData
			};
		}

		res.send(result);

	},

	getAllByArea: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		const prov = req.params.prov.toUpperCase();
		const kota = req.params.kota.toUpperCase();

		let cekArea = await resource.searchResource(optionArea, { search: { province: prov, city: kota } });

		if (!cekArea.length) {
			result.message = 'Area tidak ditemukan';

			res.send(result)
		} else {

			let rawData = await resource.searchResource(list, { search: { area_provinsi: prov, area_kota: kota } });

			if (!rawData.length) {
				result.message = 'data tidak ditemukan';
			} else {
				result = {
					code: '00',
					message: 'List data',
					data: rawData
				};
			}

			res.send(result);

		}

	},

	postRecord: async (req, res) => {

		let result;

		let payload = req.body;

		let findData = await resource.searchResource(list, { search: payload });

		payload.uuid = uuid.v4();
		payload.tgl_parsed = new Date();
		payload.timestamp = Date.now();

		if (!findData.length) {
			await resource.addResource(list, [payload]);
			result = {
				code: '00',
				message: 'Data berhasil ditambahkan'
			}
		} else {
			result = {
				code: '01',
				message: 'Data sudah ada'
			}
		}

		let cekSize = await resource.searchResource(optionSize, { search: { size: payload.size } });

		if (!cekSize.length) {
			await storeList.append(optionSize, [{ size: payload.size }]);
		}

		let cekArea = await resource.searchResource(optionArea, { search: { province: payload.area_provinsi, city: payload.area_kota } });

		if (!cekArea.length) {
			await resource.addResource(optionArea, [{ province: payload.area_provinsi, city: payload.area_kota }]);
		}

		res.send(result)

	},

	putRecord: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		let { id } = req.params;
		let payload = req.body;

		let findRecord = await resource.searchResource(list, { search: { uuid: id } });

		if (!findRecord.length) {
			result.message = 'data tidak ditemukan';
		} else {

			payload.tgl_parsed = new Date();
			await resource.updateResource(list, { search: { uuid: id }, set: payload });

			result = {
				code: '00',
				message: 'Data berhasil diedit'
			}
		}

		res.send(result);
	},

	deleteRecord: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		let { id } = req.params;

		let findRecord = await resource.searchResource(list, { search: { uuid: id } });

		if (!findRecord.length) {
			result.message = 'data tidak ditemukan';
		} else {
			await resource.deleteResource(list, { search: { uuid: id } });

			result = {
				code: '00',
				message: 'Data berhasil dihapus'
			}
		}

		res.send(result);
	},

	getMaxPriceByCommodity: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		let komoditas = req.params.commodity.toUpperCase();

		let rawData = await resource.searchResource(list, { search: { komoditas } })

		console.log(rawData);
		if (!rawData.length) {
			result.message = 'data tidak ditemukan';
		} else {
			let price = 0;

			rawData.forEach(element => {
				if (price < element.price) {
					price = element.price;
				}
			});

			result = {
				code: '00',
				message: 'Data max price',
				data: {
					komoditas, price
				}
			}
		}

		res.send(result);

	},

	getMostRecord: async (req, res) => {

		let result = {
			code: '01',
			message: '',
			data: []
		}

		let komoditas = {
			'BAWAL': 0,
			'PATIN': 0,
			'NILA HITAM': 0,
			'MAS': 0,
			'GURAME': 0,
			'BANDENG': 0,
			'LELE': 0,
			'NILA MERAH': 0
		}

		let rawData = await resource.searchResource(list)

		// console.log(rawData);
		rawData.forEach(element => {
			if (komoditas[element.komoditas] >= 0){
				komoditas[element.komoditas]++;
			}
		})

		if (!rawData.length) {
			result.message = 'data tidak ditemukan';
		} else {
			result = {
				code: '00',
				message: 'Data most record',
				data: komoditas
			}
		}

		res.send(result);

	}

}

module.exports = lib;
