// Підключаємо технологію express для back-end сервера
const express = require('express')
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

class Product {
  static #list = []

  constructor(name, price, description) {
    this.name = name
    this.price = price
    this.description = description
    this.id = Math.trunc(Math.random() * 100000)
    this.createDate = new Date().toISOString()
  }

  static getList = () => this.#list

  static add(product) {
    this.#list.push(product)
  }

  static getById = (id) =>
    this.#list.find((product) => product.id === id)

  static updateById = (id, data) => {
    const product = this.getById(id)

    if (product) {
      this.update(product, data)
      return true
    } else {
      return false
    }
  }

  static update = (
    product,
    { price, name, description },
  ) => {
    if (price) {
      product.price = price
    }
    if (name) {
      product.name = name
    }
    if (description) {
      product.description = description
    }
  }

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id,
    )

    if (index !== -1) {
      this.#list.splice(index, 1)
      return true
    } else {
      return false
    }
  }
}

// ================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/', function (req, res) {
  // res.render генерує нам HTML сторінку
  const list = Product.getList()
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('index', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'index',

    data: {},
  })
  // ↑↑ сюди вводимо JSON дані
})

// ================================================================


router.get('/product-create', function (req, res) {
  res.render('product-create', {
    style: 'product-create',
  })
})

// ================================================================

router.post('/product-create', function (req, res) {
  const { name, price, description } = req.body

  const product = new Product(name, price, description)

  Product.add(product)

  res.render('alert', {
    style: 'alert',
    title: 'Успішне виконання дії',
    info: 'Товар був успішно створений',
  })
})

// ================================================================

router.get('/product-list', function (req, res) {
  res.render('product-list', {
    style: 'product-list',
    products: Product.getList(),
  })
})

// ================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query

  const product = Product.getById(Number(id))

  if (product) {
    res.render('product-edit', {
      style: 'product-edit',
      product,
    })
  } else {
    res.render('alert', {
      style: 'alert',
      title: 'Помилка',
      info: 'Товар з таким ID не знайдено',
    })
  }
})

// ================================================================

router.post('/product-edit', function (req, res) {
  const { name, price, id, description } = req.body

  const result = Product.updateById(Number(id), {
    name,
    price,
    description,
  })

  res.render('alert', {
    style: 'alert',
    title: result ? 'Успішне виконання дії' : 'Помилка',
    info: result ? 'Товар був успішно оновлено' : '',
  })
})

// ================================================================

router.get('/product-delete', function (req, res) {
  const { id } = req.query

  const result = Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    title: result ? 'Успішне виконання дії' : 'Помилка',
    info: result ? 'Товар був успішно видалено' : '',
  })
})


// Підключаємо роутер до бек-енду
module.exports = router
