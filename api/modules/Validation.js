function validateEmail(emailAdress)
{
  let re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailAdress.match(re);
}

function validatePhoneNumber(input_str) {
  var re = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
  return re.test(input_str);
}

function validateName(input_str) {
  var re = /^[a-zA-Z\s]*$/;  
  return re.test(input_str);
}

module.exports = { validateEmail, validatePhoneNumber, validateName };