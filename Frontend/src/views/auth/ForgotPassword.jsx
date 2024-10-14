import React from "react";
import { useState } from "react";
import apiInstance from "../../utils/axios";
// import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading,setIsLoading] = useState(false)
  // const navigate = useNavigate()

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    try {
      await apiInstance.get(`user/password-reset/${email}/`).then((res) => {
        alert("An Email Has Been Sent to you");
      });
    } catch (error) {
      alert("Email does not exist");
    }
    setIsLoading(false)
  };
  return (
    <>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            {/* Section: Login form */}
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center">Forgot Password</h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <div>
                            {/* Email input */}
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Email Address
                              </label>
                              <input
                                type="text"
                                id="email"
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}
                                name="email"
                                className="form-control"
                              />
                            </div>
                            {isLoading === true 
                            ?<div className="text-center">
                            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                              Processing
                            </button>
                            </div>
                            :<div className="text-center">
                            <button className="btn btn-primary w-100" onClick={handleSubmit}>
                              Reset Password
                            </button>
                            </div>
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </section>
    </>
  );
}

export default ForgotPassword;
