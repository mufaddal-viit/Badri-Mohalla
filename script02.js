document.addEventListener("DOMContentLoaded", () => {
    alert("WELCOME!! , Enter your Sabeel Number");
  
    // DOM Elements
    const userIdInput = document.getElementById("userId");
    const nameInput = document.getElementById("name");
    const itsInput = document.getElementById("its");
    const fmbInput = document.getElementById("fmb");
    const oldSabeelInput = document.getElementById("oldsabeel");
    const newSabeelInput = document.getElementById("newsabeel");
    const dateInput = document.getElementById("date");
    const submitButton = document.getElementById("submitnow");
    const check = document.getElementById("check");
    // const popup = document.getElementById('popup');
    const popup = document.getElementById('popup'); // Ensure popup is selected outside the loop
    // Form Data Object
    const formdata = {
      sabeelnumber: 0,
      name: "",
      date: "",
      time: "",
    };
  check.addEventListener("click",()=>{
    let userIdValue = Number(userIdInput.value);
    if (userIdInput.value.length === 4 && Number.isInteger(userIdValue) && userIdValue > 0) {
        fetchData(userIdValue); // Pass userId, fetches details from excell.
        userIdInput.disabled = true;  // Disable the userId field once the sabeel id is entered.
        check.disabled = true;
    } else {
        alert("Sabeel Number Invalid, Enter 4 digit Number");
        userIdInput.value = "";
        // location.reload();
    }
    // alert("hello"+ userIdInput.value);
  })
    // Event listeners
    // userIdInput.addEventListener("keydown", (event) => {
    //     if (event.key === "Enter") {
    //         // Convert user input to a number
    //         let userIdValue = Number(userIdInput.value);
            
    //         // Sabeel ID Validation
    //         if (userIdInput.value.length === 4 && Number.isInteger(userIdValue) && userIdValue > 0) {
    //             fetchData(userIdValue); // Pass userId, fetches details from excell.
    //             userIdInput.disabled = true;  // Disable the userId field once the sabeel id is entered.
    //         } else {
    //             alert("Sabeel Number Invalid, Enter 4 digit Number");
    //             location.reload();
    //         }
    //     }
    // });
    
  
    submitButton.addEventListener("click", (event) => {
      event.preventDefault();
      //take values from input form.
      const userid = userIdInput.value;
      const name = nameInput.value;
      const date = dateInput.value;
      const selectedRadio = document.querySelector('input[name="timeSlot"]:checked');
      
      if (!userid || !name || !date || !selectedRadio) {
        alert("Please Select Time.");
        return;
      }  
      formdata.sabeelnumber = userid;
      formdata.name = name;
      formdata.date = date;
      formdata.time = selectedRadio.value;
  
      postdata(formdata);
    
    });
  
    dateInput.addEventListener("change", async (event) => {
      const selectedDate = event.target.value;
      const slotshere = await checkSlots(selectedDate);
      // You can log or use slotshere if needed
    });
  
    // Function to fetch data from Google Sheets
    async function fetchData(userId) {
      const url = `https://jumat01.onrender.com/noc/${userId}`;
  
      try {
        alert(`Please wait while checking for Sabeel number: ${userId}`);
        const response = await fetch(url);
  
        if (response.status === 404) {
          alert("Sabeel ID not available. Please contact the Jumat Office.");
        //   userIdInput.value = "";
          location.reload() 
          return;
        }
  
        if (!response.ok) throw new Error(`Error occurred: ${response.statusText}`);
  
        const userData = await response.json();
  
        nameInput.value = userData.c[1].v;
        itsInput.value = userData.c[2].v;
        fmbInput.value = userData.c[3].v;
        oldSabeelInput.value = userData.c[4].v;
        newSabeelInput.value = userData.c[5].v;
  
        alert("Name found. Please select date and time.");
        dateInput.disabled = false;
  
        // document.querySelectorAll('input[name="timeSlot"][type="radio"]').forEach(radio => radio.disabled = false);
  
      } catch (error) {
        alert("Something went wrong. Please try again later.");
        console.error("Error details:", error);
      }
    }
  
    // // Function to check slot availability
    // async function checkSlots(selectedDate) {
    //   const url = `http://localhost:3000/slots/${selectedDate}`;
      
    //   try {
    //     const response = await fetch(url);
    //     const slotData = await response.json();
  
    //     let isAnySlotAvailable = false;
    //     slotData.forEach((slot, index) => {
    //       // console.log(slot.available);
    //       const radioButton = document.querySelector(`input[id="slot${index + 1}"][type="radio"]`);
    //       const slotLabel = document.querySelector(`label[for="slot${index + 1}"]`);
              

    //       // const text = slotLabel.getAttribute('data-popup');
    //         popup.textContent = slot.available;
    //         popup.style.display = 'block';

    //         const rect = slotLabel.getBoundingClientRect();
    //         popup.style.top = `${rect.top - 40}px`; // Adjust to show above
    //         popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`; // Centered above the label



    //       radioButton.disabled = !slot.is_available;  //make it true only if slots are available
          
    //       // slotLabel.textContent = slotLabel.textContent+ `${slot.available} Available`; //show count

    //       if (slot.is_available) isAnySlotAvailable = true;
    //     });
  
    //     submitButton.disabled = !isAnySlotAvailable;
  
    //     if (!isAnySlotAvailable) alert("No seats available. Kindly select another date.");
  
    //     return slotData;
  
    //   } catch (error) {
    //     console.error("Error fetching slots:", error);
    //     alert("Error fetching slot data. Please try again later.");
    //   }
    // }
    async function checkSlots(selectedDate) {
      const url = `http://localhost:3000/slots/${selectedDate}`;
    
      try {
        const response = await fetch(url);
        const slotData = await response.json();
    
        let isAnySlotAvailable = false;
        
    
        slotData.forEach((slot, index) => {
          const radioButton = document.querySelector(`input[id="slot${index + 1}"][type="radio"]`);
          const slotLabel = document.querySelector(`label[for="slot${index + 1}"]`);
    
          // Enable/Disable the radio button based on availability
          radioButton.disabled = !slot.is_available;
    
          // Handle pop-up display for available slots when mouse enters the radio button
          const showPopup = function () {
            // if (slot.is_available) { // Only show pop-up for available slots
              // popup.textContent = `${slot.available ? 'Available' : 'Not Available'}`;
              popup.textContent = slot.available + " Available";
              popup.style.display = 'block';
    
              const rect = slotLabel.getBoundingClientRect();
              popup.style.top = `${rect.top - 40}px`; // Position above the label
              popup.style.left = `${rect.left + rect.width / 2 - popup.offsetWidth / 2}px`; // Center above the label
            // }
          };
    
          // Handle mouse leave event to hide the pop-up
          const hidePopup = function () {
            popup.style.display = 'none'; // Hide the pop-up when the mouse leaves the radio button or label
          };
    
          // Add event listeners for both radio buttons and their associated labels
          // radioButton.addEventListener('mouseenter', showPopup);
          slotLabel.addEventListener('mouseenter', showPopup);
    
          // radioButton.addEventListener('mouseleave', hidePopup);
          slotLabel.addEventListener('mouseleave', hidePopup);
    
          // If any slot is available, enable the submit button
          if (slot.is_available) {
            isAnySlotAvailable = true;
          }
        });
    
        const submitButton = document.getElementById('submitnow');
        submitButton.disabled = !isAnySlotAvailable;
    
        if (!isAnySlotAvailable) alert("No seats available. Kindly select another date.");
    
        return slotData;
    
      } catch (error) {
        console.error("Error fetching slots:", error);
        alert("Error fetching slot data. Please try again later.");
      }
    }

// Function to post data to DB
async function postdata(formdata) {
    const url = "http://localhost:3000/send";
  
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formdata),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "An error occurred");
      }
  
      const data = await response.json();
      alert(data.message);  //data saved successfully.
      alert("Name: " + formdata.name + " Date: "+ formdata.date + "  Time: "+ formdata.time);
    //   location.reload();  
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
      location.reload() ;
    }
  }
  
  });
  