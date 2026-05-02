async function run() {
  const apikey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJwaXBvemttZXF2YXZheHB2d3JtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NjEyNjksImV4cCI6MjA5MzIzNzI2OX0.mif0_2KvKUcxQEeqFbGCoypaDvrjlMqXJHcrKYSfcbA';
  const res = await fetch('https://rpipozkmeqvavaxpvwrm.supabase.co/rest/v1/?apikey=' + apikey, {
    headers: {
      'Authorization': 'Bearer ' + apikey
    }
  });
  const json = await res.json();
  if (json.definitions) console.log(Object.keys(json.definitions.leads.properties));
  else console.log(json);
}

run();
