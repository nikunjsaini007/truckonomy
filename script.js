/* company name */

let companyName = localStorage.getItem("companyName");
const companyForm = document.getElementById("companyForm");
const companyInput = document.getElementById("companyNameInput");
const companyDashName = document.getElementById("companyDashName");

function updateCompanyName() {
    if (companyName) {
    companyDashName.textContent = companyName + "'s Dashboard";
    }
}

updateCompanyName();

companyForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if(companyInput.value.trim() !== ""){
        companyName = companyInput.value.trim();
        localStorage.setItem("companyName", companyName);

        updateCompanyName();
        companyInput.value = "";
    }
});

updateCompanyName();

/* finance */

const financeForm = document.getElementById("financeForm");
let finance = JSON.parse(localStorage.getItem("finance")) || {};

function updateDashboard() {
    document.getElementById("displayMoney").textContent = finance.money || "—";
    document.getElementById("displayProfit").textContent = finance.profit || "—";
    document.getElementById("displayLoss").textContent = finance.loss || "—";
    document.getElementById("displayLevel").textContent = finance.level || "—";
}

financeForm.addEventListener("submit", (e)=>{
    e.preventDefault();
    finance.money = Number(document.getElementById("moneyInput").value) || 0;
    finance.profit = Number(document.getElementById("profitInput").value) || 0;
    finance.loss = Number(document.getElementById("lossInput").value) || 0;
    finance.level = Number(document.getElementById("levelInput").value) || 0;
    localStorage.setItem("finance", JSON.stringify(finance));
    updateDashboard();
    financeForm.reset();
});
updateDashboard();

/* trucks */

const truckForm = document.getElementById("truckForm");
let trucks = JSON.parse(localStorage.getItem("trucks")) || [];

function renderTrucks() {
    const list = document.getElementById("truckList");
    list.innerHTML = "";
    trucks.forEach((truck,index)=>{
        const card = document.createElement("div");
        card.className = "list-card";
        card.innerHTML = `
            <div class="list-card-content">
                <h4>${truck.model}</h4>
                <p>Driver: ${truck.driver}</p>
                <p>Location: ${truck.location}</p>
                <button onclick="deleteTruck(${index})">Delete</button>
            </div>`;
        list.appendChild(card);
    });
}

function deleteTruck(index){
    trucks.splice(index,1);
    localStorage.setItem("trucks",JSON.stringify(trucks));
    renderTrucks();
}

truckForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const truck = {
        model: document.getElementById("truckModel").value,
        location: document.getElementById("truckLocation").value,
        driver: document.getElementById("truckDriver").value,
    };
    trucks.push(truck);
    localStorage.setItem("trucks",JSON.stringify(trucks));
    renderTrucks();
    truckForm.reset();
});
renderTrucks();

/* drivers */

const driverForm = document.getElementById("driverForm");
let drivers = JSON.parse(localStorage.getItem("drivers")) || [];

function renderDrivers() {
    const list = document.getElementById("driverList");
    list.innerHTML = "";
    drivers.forEach((driver,index)=>{
        const card = document.createElement("div");
        card.className = "list-card";
        card.innerHTML = `
            <div class="list-card-content">
                <h4>${driver.name}</h4>
                <p>Level: ${driver.level}</p>
                <p>Earnings: €${driver.earnings}</p>
                <button onclick="deleteDriver(${index})">Delete</button>
            </div>`;
        list.appendChild(card);
    });
}

function deleteDriver(index){
    drivers.splice(index,1);
    localStorage.setItem("drivers",JSON.stringify(drivers));
    renderDrivers();
}

driverForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const driver = {
        name: document.getElementById("driverName").value,
        level: Number(document.getElementById("driverLevel").value) || 0,
        earnings: Number(document.getElementById("driverEarnings").value) || 0,
    };
    drivers.push(driver);
    localStorage.setItem("drivers",JSON.stringify(drivers));
    renderDrivers();
    driverForm.reset();
});
renderDrivers();

/* jobs */

const jobForm = document.getElementById("jobForm");
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

function renderJobs() {
    const table = document.querySelector("#jobTable tbody");
    table.innerHTML = "";

    jobs.forEach((job, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${job.driver}</td>
            <td>${job.cargo}</td>
            <td>${job.route}</td>
            <td>${job.distance} km</td>
            <td>€${job.profit}</td>
            <td>
                <button onclick="deleteJob(${index})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>`;
        table.appendChild(row);
    });
}

function updateProfit(amount){
    finance.profit = (Number(finance.profit) || 0) + Number(amount);
    finance.money = (Number(finance.money) || 0) + Number(amount);

    localStorage.setItem("finance",JSON.stringify(finance));
    updateDashboard();
}

function deleteJob(index){
    const job = jobs[index];

    finance.profit = (Number(finance.profit) || 0) - Number(job.profit);
    finance.money = (Number(finance.money) || 0) - Number(job.profit);

    jobs.splice(index,1);

    localStorage.setItem("jobs",JSON.stringify(jobs));
    localStorage.setItem("finance",JSON.stringify(finance));

    renderJobs();
    updateDashboard();
}

jobForm.addEventListener("submit",(e)=>{
    e.preventDefault();

    const job = {
        driver: document.getElementById("jobDriver").value,
        cargo: document.getElementById("jobCargo").value,
        route: document.getElementById("jobRoute").value,
        distance: Number(document.getElementById("jobDistance").value) || 0,
        profit: Number(document.getElementById("jobProfit").value) || 0
    };

    jobs.push(job);

    localStorage.setItem("jobs",JSON.stringify(jobs));

    renderJobs();
    updateProfit(job.profit);

    jobForm.reset();
});

renderJobs();

/* particle bg */

const bgCanvas = document.createElement('canvas');
document.body.appendChild(bgCanvas);
bgCanvas.style.position='fixed';
bgCanvas.style.top='0';
bgCanvas.style.left='0';
bgCanvas.style.width='100%';
bgCanvas.style.height='100%';
bgCanvas.style.zIndex='-1';
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = window.innerWidth;
bgCanvas.height = window.innerHeight;

const particles = [];
for(let i=0;i<80;i++){
    particles.push({
        x:Math.random()*bgCanvas.width,
        y:Math.random()*bgCanvas.height,
        r:Math.random()*2+1,
        dx:(Math.random()-0.5)/2,
        dy:(Math.random()-0.5)/2
    });
}

function animateParticles(){
    bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
    particles.forEach(p=>{
        p.x += p.dx;
        p.y += p.dy;
        if(p.x<0)p.x=bgCanvas.width;
        if(p.x>bgCanvas.width)p.x=0;
        if(p.y<0)p.y=bgCanvas.height;
        if(p.y>bgCanvas.height)p.y=0;
        bgCtx.beginPath();
        bgCtx.arc(p.x,p.y,p.r,0,Math.PI*2);
        bgCtx.fillStyle="rgba(34,211,238,0.4)";
        bgCtx.fill();
    });
    requestAnimationFrame(animateParticles);
}
animateParticles();

/* glow effect */

const cards = document.querySelectorAll(".card, .list-card");
cards.forEach(card=>{
    card.addEventListener("mouseenter",()=>{
        let glow=0;
        card.glowInterval = setInterval(()=>{
            glow+=0.1;
            const blur=8+Math.sin(glow*5)*6;
            card.style.boxShadow = `0 0 ${blur}px #22d3ee, 0 0 ${blur*1.5}px #0ea5e9`;
        },50);
    });
    card.addEventListener("mouseleave",()=>{
        clearInterval(card.glowInterval);
        card.style.boxShadow="";
    });
});