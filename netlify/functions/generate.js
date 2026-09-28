export async function handler(event){
  const {prompt} = JSON.parse(event.body)
  const token = process.env.REPLICATE_TOKEN
  
  let start = await fetch('https://api.replicate.com/v1/predictions',{
    method:'POST',
    headers:{Authorization:'Token '+token,'Content-Type':'application/json'},
    body: JSON.stringify({
      version:"kwaivgi/kling-v2.1",
      input:{prompt, duration:5, aspect_ratio:"16:9"}
    })
  }).then(r=>r.json())

  let pred = start
  while(pred.status!=='succeeded' && pred.status!=='failed'){
    await new Promise(r=>setTimeout(r,3000))
    pred = await fetch('https://api.replicate.com/v1/predictions/'+pred.id,{
      headers:{Authorization:'Token '+token}
    }).then(r=>r.json())
  }

  return {
    statusCode:200,
    body: JSON.stringify({video: pred.output})
  }
}
