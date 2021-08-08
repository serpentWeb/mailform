const response = await fetch('http://localhost:3000/sendEmail', {
    params: {
        name: 'Glad Valakas',
        phoneNumber: '3434234234'
    }
})