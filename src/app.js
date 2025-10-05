document.addEventListener("alpine:init", () => {
  Alpine.data("products", () => ({
    items: [
      { id: 1, name: "Gurame", img: "1.jpg", price: 20000 },
      { id: 2, name: "Mas", img: "2.jpg", price: 25000 },
      { id: 3, name: "Nila", img: "3.jpg", price: 20000 },
      { id: 4, name: "Nilem", img: "4.jpg", price: 17000 },
      { id: 5, name: "Lele", img: "5.jpg", price: 18000 },
      { id: 6, name: "Bawal", img: "6.jpg", price: 22000 },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      //cek apakah ada barang yang sama di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      //Jika belum ada/cart kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      } else {
        //Jika barang sudah ada, cek apakah barang berbeda atau sama yang ada di cart
        this.items = this.items.map((item) => {
          //Jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            //Jika barang sudah ada, tambah quantity dan totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
      }
    },
    remove(id) {
      //Ambil item yang mau di hapus berdasarkan id nya
      const cartItem = this.items.find((item) => item.id === id);

      //Jika item lebih dari 1
      if (cartItem.quantity > 1) {
        //Telusuri satu-satu
        this.items = this.items.map((item) => {
          //Jika bukan produk yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        //Jika produk sisa 1
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
      }
    },
  });
});

//Form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");

form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.lenght; i++) {
    if (form.elements[i].value.lenght !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

//Kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMassage(objData);
  window.open("http://wa.me/6285322722629?text=" + encodeURIComponent(message));
});

//  Format Pesan whatsapp
const formatMassage = (obj) => {
  return `Data Costumer
    Nama: ${obj.name}
    Email: ${obj.email}
    No Hp: ${obj.phone}
Data Pesanan
    ${JSON.parse(obj.items).map(
      (item) => `${item.name} (${item.quantity} x ${rupiah(item.total)}) \n`
    )}
    TOTAL: ${rupiah(obj.total)}
    Terimakasih.`;
};

//Konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
