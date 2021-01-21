import React from 'react';
import axios from 'axios'
import config from "../../constants/config";


class RegistrationForm extends React.Component{


    state = {
        name : '',
        username : '',
		amount : '',
		
      }

	  formvalidate=()=>{
		  
		  let error=false;
		  	if (this.state.username === "") {
				error = true;
			}

			if (this.state.name === "") {
				error = true;
			}

			if (
				isNaN(parseInt(this.state.amount)) ||
				parseInt(this.state.amount) <= 0
			) {
				error = true;
			}

			if(error)
			return false;
			else return true;
	  }


      checkout =  async (token, id) => {
		 await window.paysafe.checkout.setup(
			config.key,

			{
				currency: "USD",
				amount: this.state.amount * 100,
				singleUseCustomerToken: token,
				customerId: id,
				customer: {
					firstName: this.state.name,
					lastName: "Kumar",
					email: "akhil@gmail.com",
					phone: "9999999999",
					dateOfBirth: {
						day: 1,
						month: 7,
						year: 1990,
					},
				},
				billingAddress: {
					street: "India",
					city: "India",
					zip: "95014",
					country: "IN",
					state: "CA",
				},
				locale: "en_US",
				environment: "TEST",
				merchantRefNum: this.state.username,
				canEditAmount: false,
				displayPaymentMethods: ["card"],
				paymentMethodDetails: {
					paysafecard: {
						consumerId: id,
					},
				},
			},
			(instance, error, result) => {

				if (result && result.paymentHandleToken) {
					result["merchantRefNum"] = this.state.username;
					result["currency"] = "USD";
					result["custId"] = id;					
					
						axios.post("https://roiim-backend.herokuapp.com/payment", {
							merchantRefNum:token,
							custId:id,
							paymentHandleToken:result.paymentHandleToken,
							amount:result.amount
						})
						.then((res) => {
							
							if (res.data.message === "successful") {
								instance.showSuccessScreen(res.data.paymentId);
							} else {
								instance.showFailureScreen("Invalid Card Details");
							}
						})
						.catch((error) => {
							instance.showFailureScreen(error.correlationId);
						});
				} else {
					// error handle
					alert("Please try again");
					window.location.reload();
				}
			},
			(stage, expired) => {
				switch (stage) {
					//case "PAYMENT_HANDLE_NOT_CREATED":
					/*case "PAYMENT_HANDLE_CREATED":
					case "PAYMENT_HANDLE_REDIRECT":
					case "PAYMENT_HANDLE_PAYABLE":*/
					default:
						window.location.reload();
				}
			}
		);
	};


    


    submitDetails = (e) => {
		e.preventDefault();
			
			if(this.formvalidate()){
				
				axios.post("https://roiim-backend.herokuapp.com/create-customer", {
					merchantRefNum: this.state.username,
					name: this.state.name
				})
				.then(async (res) => {
					if (res.data.message === "successful") {
                        
                        this.checkout(res.data.token, res.data.id);
                        
					} else {
						alert("User Already registerd, Choose another username");
						window.location.reload();
						
					}
				})
				.catch(() => {
					alert("Please try again something went wrong");
				});
			}
			else{
				alert('Fill all the details and amount should be greater than zero')
			}
		} 
	


render(){
    
  return(
        <div className="card col-12 col-lg-4 login-card mt-2 hv-center">
            <form>
                <div className="form-group text-left">
                <label htmlFor="username">UserName</label>
                <input type="text" 
                       className="form-control" 
					   id="username" 
                       placeholder="Enter User Name"
                       value={this.state.username}
                       onChange={ e => this.setState({ username: e.target.value })}
                />
                
                </div>

                <div className="form-group text-left">
                    <label htmlFor="Name">Name</label>
                    <input type="text" 
                        className="form-control" 
						id="name" 
                        placeholder="Enter Name"
                        value={this.state.name}
                        onChange={e => this.setState({ name: e.target.value })}
                    />
                </div>
                <div className="form-group text-left">
                    <label htmlFor="amount">Amount</label>
                    <input type="number" 
                        className="form-control" 
						id="amount" 
                        placeholder="Enter Amount"
                        value={this.state.amount}
                        onChange={ e => this.setState({ amount: e.target.value })}
                    />
                </div>
                <button 
                    
                    type="submit" 
                    className="btn btn-primary"
                    onClick={this.submitDetails}
                >
                    PAY
                </button>
            </form>
            
            </div>
    )
}
}

export default RegistrationForm;