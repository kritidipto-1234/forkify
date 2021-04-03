import * as Config from './config.js';
import "regenerator-runtime/runtime.js";

/////////////////////////////////////////////////////////////
// BUSINESS/WEB LOGIC
///////////////////////////////////////////////////////////////////////

async function getJSONdata(url)//returns usable data from given url
{
    try
    {
        const response=await fetch(url);
        const data=(await response.json());
        if (!response.ok)
            throw new Error(`${response.status} ${data.message}`);
        return data;
    }
    catch(e)
    {
        throw new Error(e);
    }
}

async function sendJSONdata(recipe)
{
    try
    {
        console.log(recipe);
        const response =await fetch(`${Config.url}?key=${Config.key}`, 
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json',},
            body: JSON.stringify(recipe),
        });
        const data=(await response.json());
        if (!response.ok)
            throw new Error(`${response.status} ${data.message}`);
        return data;
    }
    catch(e)
    {
        throw new Error(e);
    }
}

let bookmarks;

function loadBookmarks()
{
    bookmarks=JSON.parse(window.localStorage.getItem('bookmarks'))||[];
}

function uploadBookmarks()
{
    window.localStorage.setItem('bookmarks',JSON.stringify(bookmarks));
}

function addBookmark(item)
{
    bookmarks.push(item);
    uploadBookmarks();
}

function removeBookmark(item)
{
    bookmarks.splice(bookmarks.findIndex(e=>e.id==item.id),1);
    uploadBookmarks();
}

export {getJSONdata,sendJSONdata,bookmarks,loadBookmarks,uploadBookmarks,addBookmark,removeBookmark};