const analyzePayment =(payment) =>{
    let riskLevel = "Low";
    let recommendation = "Retry Payment later";
    let explanation ="The payment may succeed on another attempts";

    //High amount
    if(payment.amount >= 5000){
        riskLevel ="High";
        recommendation="Human Review required";
        explanation="The payment amount is high,so manual verification is recommended";
    }

    //multiple payments
    else if(payment.attempts >= 2){
        riskLevel ="Medium"
        recommendation="Send Payment remainder";
        explanation="The payment has already been attempted multiple times";
    }

    //Previous Successful payments
     else if(payment.attempts >= 2){
        riskLevel ="Low"
        recommendation="Retry Payment";
        explanation="The customer has successfully completed several previous payments";
    }
    return{
        riskLevel,
        recommendation,
        explanation
    }
}
module.exports = analyzePayment;