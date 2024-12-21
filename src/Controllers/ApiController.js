import { response } from "express";
import licitacion from "../models/licitacion";
import buyer from "../models/planning/buyer";
import tenders from "../models/tenders/tenders";
import supplier from "../models/award/suppliers";
import Productos from "../models/cfdi";
import { getID } from "../helpers/getId";

const ApiController = {
  summary: async (req, res = response) => {
    let releases = licitacion;
    let buyers = buyer;
    let totalAmount = tenders;
    let contracts_amounts = tenders;
    let regexOP = new RegExp("open", "i");
    let regexSel = new RegExp("selective", "i");
    let regexdir = new RegExp("direct", "i");

    let queries = [
      releases.countDocuments(),
      buyers.countDocuments(),
      releases.countDocuments({
        "tender.procurementMethod": { regexOP },
      }),
      releases.countDocuments({
        "tender.procurementMethod": { regexSel },
      }),
      releases.countDocuments({
        "tender.procurementMethod": { regexdir },
      }),
      totalAmount.findOne(),
      contracts_amounts.findOne({ procurementMethod: regexOP }),
      contracts_amounts.findOne({ procurementMethod: regexSel }),
      contracts_amounts.findOne({ procurementMethod: regexdir }),
      contracts_amounts.findOne({ procurementMethod: null }),
    ];

    //console.log(queries);

    Promise.all(queries).then((d) => {
      //console.log(d);
      res.json({
        procedimientos: d[0],
        instituciones: d[1],
        counts: {
          open: d[2],
          selective: d[3],
          direct: d[4],
          other: d[0] - (d[2] + d[3] + d[4]),
        },
        amounts: {
          total: d[5] ? d[5].total : 0,
          open: d[6] ? d[6].total : 0,
          selective: d[7] ? d[7].total : 0,
          direct: d[8] ? d[8].total : 0,
          other: d[9] ? d[9].total : 0,
        },
      });
    });
  },
  topBuyers: async (req, res) => {
    let { n } = req.params;
    if (isNaN(n)) {
      n = 10;
    } else {
      n = Math.abs(n);
    }

    const [buyers, total] = await Promise.all([
      buyer.find({}, "id name").limit(n),
      buyer.countDocuments(),
    ]);
    res.status(200).json({
      ok: true,
      buyers,
      total,
    });
  },
  topsupplier: async (req, res) => {
    let { n } = req.params;
    if (isNaN(n)) {
      n = 10;
    } else {
      n = Math.abs(n);
    }

    //console.log(n);

    if (n >= 50) {
      n = 50;
    }

    const [suppliers, total] = await Promise.all([
      supplier.find({}, "id name").limit(n),
      supplier.countDocuments(),
    ]);
    res.status(200).json({
      ok: true,
      suppliers,
      total,
    });
  },
  search: async (req, res) => {
    const MAX_RESULTS = 10;
    let pageSize = req.body.pageSize || MAX_RESULTS;
    let page = req.body.page || 0;

    let {
      contract_title,
      ocid,
      buyer_id,
      procurementMethod,
      supplierName,
      tender_title,
      cycle,
    } = req.body;

    if (isNaN(page)) {
      page = 0;
    } else {
      page = Math.abs(page);
    }

    if (isNaN(pageSize)) {
      pageSize = MAX_RESULTS;
    } else {
      pageSize = Math.abs(pageSize);
      pageSize = pageSize > 200 ? 200 : pageSize;
    }

    let query = {};

    if (typeof buyer_id !== "undefined") {
      query["buyer.id"] = buyer_id;
    }

    if (typeof procurementMethod !== "undefined") {
      query["tender.procurementMethod"] = procurementMethod;
    }

    if (typeof contract_title !== "undefined") {
      query["contracts.title"] = { $regex: contract_title, $options: "i" };
    }

    if (typeof tender_title !== "undefined") {
      query["tender.title"] = { $regex: tender_title, $options: "i" };
    }

    if (typeof cycle !== "undefined") {
      query["cycle"] = cycle;
    }

    if (typeof supplierName !== "undefined") {
      query["$and"] = [
        {
          "parties.name": {
            $regex: supplierName,
            $options: "i",
          },
        },
        { "parties.roles": "buyer" },
      ];
    }

    if (typeof ocid !== "undefined") {
      query["ocid"] = ocid;
    }

    let options = {
      limit: pageSize,
      skip: page * pageSize,
      sort: { cycle: -1, date: -1 },
    };

    let data = await licitacion.countDocuments(query).then((count) => {
      licitacion.find(query, options);
      res.json({
        pagination: {
          total: count,
          page: page,
          pageSize: pageSize,
        },
        data,
      });
    });

    // lic.countDocuments(query).then((count) => {
    //   lic.find(query, options).fetch((error, data) => {
    //     res.json({
    //       pagination: {
    //         total: count,
    //         page: page,
    //         pageSize: pageSize,
    //       },
    //       data: data,
    //     });
    //   });
    // });
  },
  release: async (req, res) => {
    const id = req.params.ocid;
    try {
      let ID = getID(licitacion);
      const lic = await licitacion
        .findById(id)
        .populate("parties", "-__v")
        .populate("buyer", "-__v")
        .populate("tender", "-__v");

      const text = JSON.stringify(data, null, 4);
      res.setHeader("Content-type", "application/octet-stream");
      res.setHeader(
        "Content-disposition",
        "attachment; filename=" + ocid + ".json"
      );

      res.send(text);
    } catch (error) {
      res.status(200).json({
        msg: "no existe ocid",
      });
    }
  },

  cfdi: async (req, res) => {
    let busqueda = req.query.search;
    let limite = req.query.limit;
    if (busqueda == undefined || busqueda == null) {
      busqueda = "No existe en el catálogo";
    } else {
      busqueda = busqueda;
    }
    try {
      const regex = new RegExp(busqueda, "i");
      const producto = await Productos.find({ description: regex }).limit(
        limite
      );
      return res.status(200).json({
        prod: producto,
      });
    } catch (error) {
      return res.status(200).json({
        prod: "No existen registros",
      });
    }
  },

  searchcfdi: async (req, res) => {
    try {
      let key = req.params.key
      const producto = await Productos.findOne({ key: key });//console.log(producto);
      return res.status(200).json({
        producto: producto,
      });
    } catch (error) {
      return res.status(200).json({
        prod: "No existen registros",
      });
    }
  },
};

module.exports = ApiController;
