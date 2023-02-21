import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  addDoc,
  setDoc,
  Timestamp,
  query,
  where,
  orderBy,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import createChart from "./chart.js";
import imgur from "./imgur.js";
const firebaseConfig = {
  apiKey: "AIzaSyDPRxQHu--hMXD-v6fnfNBJOcCuiIY8vYQ",
  authDomain: "managers-89d82.firebaseapp.com",
  projectId: "managers-89d82",
  storageBucket: "managers-89d82.appspot.com",
  messagingSenderId: "556885528",
  appId: "1:556885528:web:905cdbfd31aac4c912c56d",
  measurementId: "G-C286MK412E",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);
// element
const loader = document.querySelector("#loading-spinner");
const productTable = document.querySelector(".table");
let tbody = productTable.querySelector("tbody");
let modal = document.querySelector(".wapperModal");

// html modal
let htmlmodal = `
<!-- modal add product -->
<div class="modal fade" id="product" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">New Product</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="productName" class="col-form-label">product Name</label>
                        <input type="text" class="form-control" id="productName">
                    </div>

                    <div class="mb-3">
                        <label for="productPrice" class="col-form-label">product Price</label>
                        <input type="number" class="form-control" id="productPrice">
                    </div>
                    <div class="mb-3">
                        <label for="productAmount" class="col-form-label">product Amount</label>
                        <input type="number" class="form-control" id="productAmount">
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="status">
                        <label class="form-check-label" for="status">Stocking</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary addProduct">Add product</button>
            </div>
        </div>
    </div>
</div>
<!-- end modal -->
<!-- modal update product -->
<div class="modal fade" id="editProduct" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Product</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <input class="form-check-input" type="hidden" role="switch" id="idProduct">
                    <div class="mb-3">
                        <label for="productName" class="col-form-label">product Name</label>
                        <input type="text" class="form-control" id="productNameEdit">
                    </div>
                    <div class="mb-3">
                        <label for="productPrice" class="col-form-label">product Price</label>
                        <input type="number" class="form-control" id="productPriceEdit">
                    </div>
                    <div class="mb-3">
                        <label for="productAmount" class="col-form-label">product Amount</label>
                        <input type="number" class="form-control" id="productAmountEdit">
                    </div>
                    <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" id="statusEdit">
                        <label class="form-check-label" for="statusEdit">Stocking</label>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-primary editProductNow">Edit now</button>
            </div>
        </div>
    </div>
</div>
`;
//
function renderProduct(id, data, index) {
  let html = `
 <tr>
  <th scope="row">${index}</th>
  <td>${data.productName}</td>
  <td>${data.productPrice}</td>
  <td>${data.productAmount}</td>
  <td  style="color: ${data.status ? "green" : "red"} ;" >${
    data.status ? "Còn hàng" : "Hết hàng"
  }</td>
  <td>
      <button type="button" class="btn btn-info editProduct" data-idProduct="${id}" data-bs-toggle="modal"
      data-bs-target="#editProduct">
          <i class="fa-regular fa-pen-to-square"></i>
      </button>
  </td>
  <td>
      <button type="button" class="btn btn-danger deleteProduct" data-idProduct="${id}">
          <i class="fa-regular fa-trash-can"></i>
      </button>
  </td>
</tr>
  `;
  tbody.insertAdjacentHTML("beforeend", html);
}
// renderProduct();
const reset = () => {
  loader.style.display = "block";
  tbody.innerHTML = "";
};
function App() {
  console.log("render lai");
  console.log(modal);
  modal.innerHTML = htmlmodal;
  // element
  let productNameE = document.querySelector("#productName");
  let productAmountE = document.querySelector("#productAmount");
  let productPriceE = document.querySelector("#productPrice");
  let switchE = document.querySelector("#status");
  const addProduct = document.querySelector(".addProduct");
  let productNameEdit = document.querySelector("#productNameEdit");
  let productPriceEdit = document.querySelector("#productPriceEdit");
  let productAmountEdit = document.querySelector("#productAmountEdit");
  let statusEdit = document.querySelector("#statusEdit");
  let idProductEdit = document.querySelector("#idProduct");
  let editProductNow = document.querySelector(".editProductNow");
  //
  const handelAddProduct = async () => {
    let productName = productNameE.value;
    // let productImg = await imgur(productImgE.files[0]);
    let productAmount = productAmountE.value;
    let productPrice = productPriceE.value;
    let status = switchE.checked;
    let newProduct = {
      productName,
      // productImg,
      productAmount: Number(productAmount),
      productPrice: Number(productPrice),
      status,
      created: Timestamp.now(),
    };
    addDoc(ProductRef, newProduct)
      .then(() => {
        iziToast.show({
          color: "green",
          title: "Thành công",
          message: "Sản phẩm của bạn được thêm vào !",
          position: "topRight",
          timeout: 3000,
        });
        App();
      })
      .catch((err) => console.log(err));
  };
  const handelUpdateProduct = (
    id,
    productName,
    productAmount,
    productPrice,
    status
  ) => {
    const productRef = doc(db, "product", id);
    return setDoc(
      productRef,
      {
        productName,
        productAmount: Number(productAmount),
        productPrice: Number(productPrice),
        status,
      },
      { merge: true }
    );
  };
  let data = [];
  let labels = [];
  reset();
  const ProductRef = collection(db, "product");
  const ProductQuery = query(ProductRef, orderBy("created", "asc"));
  getDocs(ProductQuery)
    .then((snap) => {
      let i = 0;
      loader.style.display = "none";
      snap.forEach((doc) => {
        //   console.log(doc.id);
        //   console.log(doc.data());
        labels.push(doc.data().productName);
        data.push(doc.data().productAmount);
        renderProduct(doc.id, doc.data(), i);
        i++;
      });
    })
    .then(() => {
      createChart(data, labels);
    })
    .then(() => {
      const deleteProduct = document.querySelectorAll(".deleteProduct");
      deleteProduct.forEach((del) => {
        del.addEventListener("click", () => {
          reset();
          deleteDoc(doc(db, "product", del.dataset.idproduct))
            .then(() => {
              iziToast.show({
                color: "red",
                title: "Thành công",
                message: "Sản phẩm của bạn đã được xoá!",
                messageColor: "#000",
                titleColor: "#000",
                position: "topRight",
                timeout: 1000,
              });
              App();
            })
            .catch(() => {
              addProduct.removeEventListener("click", handelAddProduct, false);
            });
        });
      });
      addProduct.addEventListener("click", handelAddProduct);
      const editProducts = document.querySelectorAll(".editProduct");
      console.log(editProducts);
      editProducts.forEach((edit) => {
        edit.addEventListener("click", () => {
          const docRef = doc(db, "product", edit.dataset.idproduct);
          getDoc(docRef).then((data) => {
            idProductEdit.value = edit.dataset.idproduct;
            productNameEdit.value = data.data().productName;
            productPriceEdit.value = data.data().productPrice;
            productAmountEdit.value = data.data().productAmount;
            statusEdit.checked = data.data().status;
          });
        });
      });
      editProductNow.addEventListener(`click`, () => {
        console.log(
          idProductEdit.value,
          productNameEdit.value,
          productPriceEdit.value,
          productAmountEdit.value,
          statusEdit.checked
        );
        handelUpdateProduct(
          idProductEdit.value,
          productNameEdit.value,
          productAmountEdit.value,
          productPriceEdit.value,
          statusEdit.checked
        ).then(() => {
          iziToast.show({
            color: "green",
            title: "Thành công",
            message: "Sản phẩm của bạn đã được sữa !",
            messageColor: "#000",
            titleColor: "#000",
            timeout: 1000,
          });
          App();
        });
      });
    });
  // .catch((err) => {
  //   alert(`Looi ${err}`);
  // });
}
App();
