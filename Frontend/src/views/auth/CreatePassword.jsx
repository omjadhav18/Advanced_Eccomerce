import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePassword() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const otp = searchParams.get("otp");
  const uuid64 = searchParams.get("uuid64");

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== password2) {
      alert("Password Does Not Matched");
    } else {
      const formdata = new FormData();
      formdata.append("password", password);
      formdata.append("otp", otp);
      formdata.append("uuid64", uuid64);

      try {
        await apiInstance
          .post("user/password-change/", formdata)
          .then((res) => {
            console.log(res.data);
            alert("Password Changed Successfully!");
            navigate("/login");
          });
      } catch (error) {
        alert(error);
      }
    }
  };
  return (
    <>
      <section>
        <main className="" style={{ marginBottom: 100, marginTop: 50 }}>
          <div className="container">
            <section className="">
              <div className="row d-flex justify-content-center">
                <div className="col-xl-5 col-md-8">
                  <div className="card rounded-5">
                    <div className="card-body p-4">
                      <h3 className="text-center">Create New Password</h3>
                      <br />

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
                          <form>
                            {/* Email input */}
                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Enter New Password
                              </label>
                              <input
                                type="password"
                                value={password}
                                onChange={(e)=>setPassword(e.target.value)}
                                id="email"
                                required
                                name="password"
                                className="form-control"
                              />
                            </div>

                            <div className="form-outline mb-4">
                              <label className="form-label" htmlFor="Full Name">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                id="email"
                                value={password2}
                                onChange={(e)=>setPassword2(e.target.value)}
                                required
                                name="confirmPassword"
                                className="form-control"
                              />
                            </div>

                            <div className="text-center">
                              <button
                                type="submit"
                                onClick={handlePasswordSubmit}
                                className="btn btn-primary w-100"
                              >
                                Reset Password
                              </button>
                            </div>
                          </form>
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
