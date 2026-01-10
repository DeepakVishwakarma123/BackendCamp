///we can understand the promise with a new perspective

const promiseObj=new Promise((resolve, reject) => {
     setTimeout(() => {
        console.log('file reading now')
        resolve("file buffer is here")
     }, 2000);
})

// console.log(promiseObj);

promiseObj.then(
    () => {
        console.log(promiseObj);   
    }
)





