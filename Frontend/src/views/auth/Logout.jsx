import React, { useEffect } from "react";
import { logout } from "../../utils/auth";
import { Link } from "react-router-dom";

function Logout() {
  useEffect(() => {
    logout();
    console.log("logout is successful");
  }, []);
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
                      <h4 className="text-center">You logged out successfully</h4>
                      <br />
                      <Link to={'/login'} className="btn btn-primary">Login</Link>

                      <div className="tab-content">
                        <div
                          className="tab-pane fade show active"
                          id="pills-login"
                          role="tabpanel"
                          aria-labelledby="tab-login"
                        >
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

export default Logout;
