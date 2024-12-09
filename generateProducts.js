const axios = require('axios');
const Chance = require('chance');
const chance = new Chance();

const generateProduct = () => {
  let product = {
    name: chance.string({ length: 50 }),
    price: parseFloat(chance.floating({ min: 0, max: 1000, fixed: 2 })),
    description: chance.string({ length: 200 }), // Descrição com 200 caracteres
    productId: chance.guid(),
    category: chance.string({ length: 50 }), // Categoria com 50 caracteres
    images: [chance.url({ length: 30 })],
    stock: chance.integer({ min: 0, max: 100 }),
    createdAt: chance.date({ year: 2022 }),
    updatedAt: new Date(),
    ratings: chance.floating({ min: 0, max: 5, fixed: 1 }),
  };

  let productString = JSON.stringify(product);
  let productSize = Buffer.byteLength(productString, 'utf8');

  // Ajusta o tamanho até que o produto tenha aproximadamente 1KB
  const targetSize = 1024; // 1KB em bytes

  // Reduz os campos iterativamente até que o produto caiba no tamanho alvo (1KB)
  while (productSize > targetSize) {
    if (product.description.length > 100) {
      product.description = product.description.substring(0, product.description.length - 50); // Reduz a descrição
    } else if (product.name.length > 30) {
      product.name = product.name.substring(0, product.name.length - 10); // Reduz o nome
    } else if (product.category.length > 30) {
      product.category = product.category.substring(0, product.category.length - 10); // Reduz a categoria
    } else if (product.images.length > 1) {
      product.images = product.images.slice(0, product.images.length - 1); // Remove imagens
    } else {
      break; // Caso não seja mais possível reduzir o produto
    }

    // Recalcula o tamanho do produto após a redução
    productString = JSON.stringify(product);
    productSize = Buffer.byteLength(productString, 'utf8');
  }

  return product;
};

const postProduct = async (product, i) => {
  try {
    const response = await axios.post('http://localhost:3001/api/products', product);
    console.log(`${i} - Product posted: ${response.data.name}`);
  } catch (error) {
    console.error(`Error posting product: ${error.message}`);
  }
};

const postProducts = async (count) => {
  for (let i = 0; i < count; i++) {
    const product = generateProduct();
    await postProduct(product, i);
  }
};

// Postar 10.000 produtos
postProducts(10000).then(() => {
  console.log('All products have been posted');
});
