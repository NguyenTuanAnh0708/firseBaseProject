import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";
import createChart from "./chart.js";
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
const addProduct = document.querySelector(".addProduct");
let tbody = productTable.querySelector("tbody");
let productNameE = document.querySelector("#productName");
let productAmountE = document.querySelector("#productAmount");
let productPriceE = document.querySelector("#productPrice");
//
function renderProduct(id, data, index) {
  let html = `
 <tr>
  <th scope="row">1</th>
  <td>${data.productName}</td>
  <td><img src="${data.productImg}"
          alt="${data.productName}"></td>
  <td>${data.productPrice}</td>
  <td>${data.productAmount}</td>
  <td  style="color: ${data.status ? "green" : "red"} ;" >${
    data.status ? "Còn hàng" : "Hết hàng"
  }</td>
  <td>
      <button type="button" class="btn btn-info">
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
const ProductRef = collection(db, "product");
function App() {
  let data = [];
  let labels = [];
  reset();
  getDocs(ProductRef)
    .then((snap) => {
      loader.style.display = "none";
      snap.forEach((doc) => {
        //   console.log(doc.id);
        //   console.log(doc.data());
        labels.push(doc.data().productName);
        data.push(doc.data().productAmount);
        renderProduct(doc.id, doc.data());
      });
    })
    .then(() => {
      createChart(data, labels);
    })
    .then(() => {
      const deleteProduct = document.querySelectorAll(".deleteProduct");
      console.log(deleteProduct);
      deleteProduct.forEach((del) => {
        del.addEventListener("click", () => {
          reset();
          deleteDoc(doc(db, "product", del.dataset.idproduct)).then(() => {
            App();
          });
        });
      });
      addProduct.addEventListener("click", () => {
        let productName = productNameE.value;
        let productAmount = productAmountE.value;
        let productPrice = productPriceE.value;
        let newProduct = {
          productName,
          productAmount: Number(productAmount),
          productPrice: Number(productPrice),
        };
        addDoc(ProductRef, newProduct).then(() => {
          App();
        });
      });
    });
}
App();
