import count from "../models/count";

const getID = async (model, ocid = false) => {
  const cont = await model.countDocuments(); //1
  const ult = model.id;
  const id = process.env.ID_CONTRACTGENERATE;
  const buy = await count.findById({_id: id});
  //console.log(id);
  let co = buy.contract_count;
  let numID = 0;
  numID = cont + 1;
  if (ocid) {
    return setOCID(co);
  } else {
    return numID;
  }
};

const setOCID = (id) => {
  let ocid = process.env.OCID;
  let idi = zfill(id, 5);
  ocid += `000-${idi}`;

  //console.log(ocid);
  return ocid;
};

function zfill(number, width) {
  var numberOutput = Math.abs(number); /* Valor absoluto del número */
  var length = number.toString().length; /* Largo del número */
  var zero = "0"; /* String de cero */

  if (width <= length) {
    if (number < 0) {
      return "-" + numberOutput.toString();
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return "-" + zero.repeat(width - length) + numberOutput.toString();
    } else {
      return zero.repeat(width - length) + numberOutput.toString();
    }
  }
}

export default getID;