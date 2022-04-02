function validateEmail(input_str)
{
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(input_str);
}

function validateName(input_str) {
  var re = /^[a-zA-Z\s]*$/;  
  return re.test(input_str);
}

module.exports = { validateEmail, validateName };