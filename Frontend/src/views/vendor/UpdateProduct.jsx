import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import UserData from "../plugin/UserData";
import apiInstance from "../../utils/axios";
import { Link ,useNavigate,useParams } from "react-router-dom";
import moment from "moment";
import Swal from "sweetalert2";

function UpdateProduct() {
    const userData = UserData()
    const param = useParams()

    const [product, setProduct] = useState({});
    
      const [specifications, setSpecifications] = useState([{title: "",content: "",},]);
      const [colors, setColors] = useState([{name: "",color_code: "",},]);
      const [sizes, setSizes] = useState([{name: "",price: "",},]);
      const [gallery, setGallery] = useState([{ image: "" }]);
      const [category, setCategory] = useState([]);    

      const navigate = useNavigate()

      const handleAddMore = (setStateFuncion) => {
        setStateFuncion((prevState) => [...prevState, {}]);
      };
    
      const handleRemove = (index, setStateFuncion) => {
        setStateFuncion((prevState) => {
          const newState = [...prevState];
          newState.splice(index, 1);
          return newState;
        });
      };
    
      const handleInputChange = (index, field, value, setStateFuncion) => {
        setStateFuncion((prevState) => {
          const newState = [...prevState];
          newState[index][field] = value;
    
          return newState;
        });
      };
    
      const handleImageChange = (index, event, setStateFuncion) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
    
          reader.onloadend = () => {
            setStateFuncion((prevState) => {
              const newState = [...prevState];
              newState[index].image = { file, preview: reader.result };
              return newState;
            });
          };
          reader.readAsDataURL(file);
        } else {
          setStateFuncion((prevState) => {
            const newState = [...prevState];
            newState[index].image = null;
            newState[index].preview = null;
            return newState;
          });
        }
      };
    
      const handleProductInputChange = (event) => {
        setProduct({
          ...product,
          [event.target.name]: event.target.value,
        });
      };
    
      const handleProductFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
    
          reader.onloadend = () => {
            setProduct({
              ...product,
              image: {
                file: event.target.files[0],
                preview: reader.result,
              },
            });
          };
          reader.readAsDataURL(file);
        }
      };
      
      useEffect(() => {
        apiInstance.get(`category/`).then((response) => {
          setCategory(response.data);
        });
      }, []);

      useEffect(()=>{
        apiInstance.get(`vendor-update-product/${userData?.vendor_id}/${param.pid}/`).then((response)=>{
            setProduct(response.data)
            setColors(response.data.color)
            setSizes(response.data.size)
            setSpecifications(response.data.specification)
            setGallery(response.data.gallery)
        })
      },[])


      const handleSubmit = async (e) =>{
        e.preventDefault()
    
        const formdata = new FormData()
        Object.entries(product).forEach(([key,value])=>{
          if(key==='image' && value){
            formdata.append(key,value.file)
          }else{
            formdata.append(key,value)
    
          }
        })
    
        specifications.forEach((specification,index)=>{
          Object.entries(specification).forEach(([key,value])=>{
            formdata.append(`specifications[${index}][${key}]`,value)
          })
        })
    
        colors.forEach((color,index)=>{
          Object.entries(color).forEach(([key,value]) =>{
            formdata.append(`colors[${index}][${key}]`,value)
          })
        })
    
        sizes.forEach((size,index)=>{
          Object.entries(size).forEach(([key,value])=>{
            formdata.append(`sizes[${index}][${key}]`,value)
          })
        })
    
        gallery.forEach((item,index)=>{
          if(item.image){
            formdata.append(`gallery[${index}][image]`,item.image.file)
          }
        })
    
        const response = await apiInstance.patch(`vendor-update-product/${userData?.vendor_id}/${param.pid}/`,formdata,{
          headers:{
            'Content-Type':'multipart/form-data'
          }
        })
        Swal.fire({
          icon:"success",
          title:'Product Updated Successfully',
          timer:1500,
        })
        navigate('/vendor/products/')
    
    
      }

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />

        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="container">
            <form onSubmit={handleSubmit} enctype="multipart/form-data" className="main-body">
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Product Details</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                            <div className="row text-dark">
                              <div className="col-lg-6 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Product Thumbnail
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  name="image"
                                  onChange={handleProductFileChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="title"
                                  value={product.title || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Description
                                </label>
                                <textarea
                                  className="form-control"
                                  id=""
                                  cols={30}
                                  rows={10}
                                  name="description"
                                  value={product.description || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-12 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Category
                                </label>
                                <select
                                  className="select form-control"
                                  name="category"
                                  value={product.category || ""}
                                  onChange={handleProductInputChange}
                                >
                                  <option value="">- Select -</option>
                                  {category?.map((category, index) => (
                                    <option value={category.id} key={index}>
                                      {category.title}
                                    </option>
                                  ))}
                                </select>
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Sale Price
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="price"
                                  value={product.price || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Regular Price
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="old_price"
                                  value={product.old_price || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Shipping Amount
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="shipping_amount"
                                  value={product.shipping_amount || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                              <div className="col-lg-6 mb-2 ">
                                <label htmlFor="" className="mb-2">
                                  Stock Qty
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  name="stock_qty"
                                  value={product.stock_qty || ""}
                                  onChange={handleProductInputChange}
                                />
                              </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Product Image</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {gallery.map((item, index) => (
                            <div className="row text-dark" key={index}>
                              <div className="col-lg-6 mb-2">

                                {item.image && (item.image.preview ? (
                                  <img style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", }} src={item.image.preview} />
                                ):(
                                    <img style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px", }} src={item.image} />
                                ))}

                                {!item.image && (
                                  <img
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                    }}
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTar_ouGael5ODlrC1kbFbKLpEPSJtTQqdaIg&s"
                                  />
                                )}
                              </div>
                              <div className="col-lg-3 mb-2">
                                <label htmlFor="" className="mb-2">
                                  Product Image
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  name=""
                                  onChange={(e) =>
                                    handleImageChange(index, e, setGallery)
                                  }
                                />
                              </div>
                              <div className="col-lg-3">
                                <button
                                  onClick={() =>
                                    handleRemove(index, setGallery)
                                  }
                                  className="btn btn-danger mt-4"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {gallery.length < 1 && <h5>No Images Selected</h5>}

                          <button type="button"
                            onClick={() => handleAddMore(setGallery)}
                            className="btn btn-primary mt-5"
                          >
                            <i className="fas fa-plus" /> Add Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Specifications</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {specifications.map((specification, index) => (
                            <div className="row text-dark" key={index}>
                              <div className="col-lg-5">
                                <label>Title</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name=""
                                  value={specification.title}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "title",
                                      e.target.value,
                                      setSpecifications
                                    )
                                  }
                                />
                              </div>
                              <div className="col-lg-5 ">
                                <label>Content</label>
                                <input
                                  type="text"
                                  value={specification.content}
                                  className="form-control"
                                  name=""
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "content",
                                      e.target.value,
                                      setSpecifications
                                    )
                                  }
                                />
                              </div>
                              <div className="col-lg-2 ">
                                <button
                                  onClick={() =>
                                    handleRemove(index, setSpecifications)
                                  }
                                  className="btn btn-danger mt-4"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {specifications.length < 1 && (
                            <h5>No Specifications Selected</h5>
                          )}

                          <button type="button"
                            onClick={() => handleAddMore(setSpecifications)}
                            className="btn btn-primary mt-5"
                          >
                            <i className="fas fa-plus" /> Add Specifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Size</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row text-dark">
                            <div className="col-lg-6 mb-2">
                              <label htmlFor="" className="mb-2">
                                Title
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name=""
                                id=""
                              />
                            </div>
                            <div className="col-lg-6 mb-2">
                              <label htmlFor="" className="mb-2">
                                Content
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name=""
                                id=""
                              />
                            </div>
                          </div>
                          <button type="button" className="btn btn-primary mt-5">
                            <i className="fas fa-plus" /> Add Specifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-size"
                  role="tabpanel"
                  aria-labelledby="pills-size-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Size</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                            {sizes.map((size,index)=>(
                          <div className="row text-dark" key={index}>
                          <div className="col-lg-5">
                            <label>
                              Size
                            </label>
                            <input
                              type="text"
                              value={size.name || ''}
                              className="form-control"
                              placeholder="XXL"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "name",
                                  e.target.value,
                                  setSizes,
                                )
                              }
                            />
                          </div>
                          <div className="col-lg-5">
                            <label>
                              Price
                            </label>
                            <input
                              type="number"
                              value={size.price || ''}
                              placeholder="$20"
                              className="form-control"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "price",
                                  e.target.value,
                                  setSizes,
                                )
                              }
                            />
                          </div>
                          <div className="col-lg-2">
                                <button type="button" onClick={()=>handleRemove(index,setSizes)} className="btn btn-danger mt-4">Remove</button>
                          </div>
                        </div>
                            ))}
                            {sizes.length<1 &&
                            <h5>No Sizes Selected</h5>
                            }
                          <button type="button" onClick={()=>handleAddMore(setSizes)} className="btn btn-primary mt-5">
                            <i className="fas fa-plus" /> Add Size
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-color"
                  role="tabpanel"
                  aria-labelledby="pills-color-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Color</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                            {colors.map((color,index)=>(
                          <div className="row text-dark"  key={index}>
                          <div className="col-lg-5 mb-2">
                            <label>
                              Name
                            </label>
                            <input
                              type="text"
                              value={color.name || ''}
                              className="form-control"
                              placeholder="Green"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "name",
                                  e.target.value,
                                  setColors,
                                )
                              }
                            />
                          </div>
                          <div className="col-lg-5 mb-2">
                            <label>
                              Code
                            </label>
                            <input
                              type="text"
                              value={color.color_code || ''}
                              placeholder="#f4f7f6"
                              className="form-control"
                              onChange={(e) =>
                                handleInputChange(
                                  index,
                                  "color_code",
                                  e.target.value,
                                  setColors,
                                )
                              }
                            />
                          </div>
                          <div className="col-lg-2">
                            <button type="button" onClick={()=>handleRemove(index,setColors)} className="btn btn-danger mt-4">Remove</button>
                          </div>
                        </div>
                            ))}
                            {colors.length<1 &&
                            <h5>No Colors Selected</h5>
                            }

                          <button type="button" onClick={()=>handleAddMore(setColors)} className="btn btn-primary mt-5">
                            <i className="fas fa-plus" /> Add Color
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <ul
                    className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        Basic Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                        aria-controls="pills-profile"
                        aria-selected="false"
                      >
                        Gallery
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-contact-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-contact"
                        type="button"
                        role="tab"
                        aria-controls="pills-contact"
                        aria-selected="false"
                      >
                        Specifications
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-size-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-size"
                        type="button"
                        role="tab"
                        aria-controls="pills-size"
                        aria-selected="false"
                      >
                        Size
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-color-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-color"
                        type="button"
                        role="tab"
                        aria-controls="pills-color"
                        aria-selected="false"
                      >
                        Color
                      </button>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-center mb-5">
                    <button className="btn btn-success w-50" type="submit">
                      Create Product <i className="fa fa-check-circle" />{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateProduct
