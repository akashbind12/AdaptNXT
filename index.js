
const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");
const { Parser } = require('json2csv');

const url = "https://www.quill.com/hanging-file-folders/cbk/122567.html";

let data = [];
let name = [];
let price = [];
let item_no = [];
let modal_no = [];
let dis = [];

axios.get(url).
    then((response) => {
       
        let $ = cheerio.load(response.data);
        
        //--------------------------scraping data----------------//
        $('#ResultsSection div').each(function (el, index) {
            
            let Name = $(this).find('a[class="desc4 scTrack pfm sku-description"]').text().trim()
            let Price = $(this).find('span[class="priceupdate"]').text()
            let Item_Number = $(this).find('div[class="iNumber formLabel lblItemNo adptfont"]').text().trim()
            let Model_Number = $(this).find('div[class="model-number"]').text().trim()
            let Description = $(this).find('div[class="skuBrowseBullet"]').text().trim()

            if (Name !== ""  && name[name.length-1] != Name) {
                name.push(Name)
            }
            if (Price !== ""  && price[price.length-1] != Price) {
                price.push(Price)
            }
            if (Item_Number !== ""  && item_no[item_no.length-1] != Item_Number) {
                item_no.push(Item_Number)
            }
            if (Model_Number !== ""  && modal_no[modal_no.length-1] != Model_Number) {
                modal_no.push(Model_Number)
            }
            if (Description !== ""  && dis[dis.length-1] != Description) {
                dis.push(Description)
            }
        })
       
        //--------------------------making array of data object----------------//
        for (let i = 0; i < 10; i++){
            data.push({
                "Product Name" : name[i],
                "Product Price" : price[i],
                "Item Number/ SKU/ Product Code" : item_no[i],
                "Model Number" : modal_no[i],
                "Product Category" : "hanging-file-folders",
                "Product Description" : dis[i]  
            })
        }
        // console.log(data)
        // console.log(data.length)
         
        //--------------------------coverting data into csv file----------------//
        const fields = ['Product Name', "Product Price", "Item Number/ SKU/ Product Code", "Model Number", "Product Category", "Product Description"];
        const opts = { fields };
        
        const parser = new Parser(opts);
        const csv = parser.parse(data);
        console.log(csv);

        fs.writeFileSync("./data.csv", csv, "utf-8");

    }).catch((err) => {
    console.log(err)
    })

 
   