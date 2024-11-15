const deleteProduct = (btn) => {
  const { value: productId } = btn.parentNode.querySelector('[name=productId]')
  const { value: csrf } = btn.parentNode.querySelector('[name=_csrf]')

  const articleElement = btn.closest('article')

  fetch(`/admin/product/${productId}`, {
    method: 'DELETE',
    headers: {
      'csrf-token': csrf,
    },
  })
    .then((result) => result.json())
    .then((data) => {
      articleElement.remove()
    })
    .catch(console.error)
}
