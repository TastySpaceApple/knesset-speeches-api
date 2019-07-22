# Knesset Speeches API

The Knesset does not have an API to get details about the speeches. Why not? don't know why. But they do have heavily secured and yet still scrape-able HTML pages in the website. This is here to bridge that gap.

                  ------------------------
         HTML --> | Knesset Speeches API |   <-- any other app
                  ------------------------

The Chrome Extension (Scraper)
-------------------------------

For some reason, despite the Knesset working for the public, and thus discussions should be in the public domain and openly available, they are protected by Reblaze to prevent scraping. In my opinion, they should have actually created an open API!.

And so this chrome extension scrapes the dam glitchy app that was built to view the assembly and sends the data to a server that HAS an open API.

It took me a few hours to make this, and so I would like to extend the finger towards the management of the Knesset's website: ╭∩╮
