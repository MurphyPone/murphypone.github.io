---
title: "How to Deploy a Website Built with Flask to Google Cloud under a Domain.com name"
date: "2020-08-15"
description: "Python, Flask, Google Cloud, Domain.com"
path: "/blog/how-to-deploy-a-website"
---

## Outline 
1. introduction
    - purpose
    - tools used: Google Compute Engine, Python (flask), 
    - experience required
2. Install python, flask, get GC credits, Secure a free domain, a CC (though not costs)


#### Securing a Domain
- go to DDC and get a free .tech, .online, or .space (or cough up beans for another type)
- "Ellie the Electric Elephant"
    - explain limitations and what we're getting
    - explain how we don't actually have to pay using the code

#### Setting up our CPE
- create new project 

    ![](/static/images/clp/gcp-1.png)
    - wait for "Compute Engine is getting ready. This may take a minute or more." to resolve

- create new VM instance 

    ![](/static/images/clp/gcp-2.png)

- configure it // explain why it can be smol and note the cost

![](/static/images/clp/gcp-3.png)
![](/static/images/clp/gcp-4.png)
![](/static/images/clp/gcp-5.png)

- Wait for it to create

![](/static/images/clp/gcp-6.png)


#### Installing dependencies
- ssh into instance in browser

![](/static/images/clp/dep-1.png)

- Ubuntu 20 comes with Python 3.8 installed on it, we can verify by typing `python3 -V` and see `Python 3.8.x`
    ![](/static/images/clp/dep-2.png)
- in order to install dependencies we need to update the _things_ on our vm with `sudo apt update` - [link](https://linuxize.com/post/how-to-install-pip-on-ubuntu-20.04/)
- install pip with `sudo apt install pip3`

    ![](/static/images/clp/dep-3.png)

- install flask for _explanation of Flask_ `pip3 install Flask`, should get a success message like `Successfully installed Flask-1.1.2 Werkzeug-1.0.1 itsdangerous-1.1.0`

#### Assume they have a website / show some simple code

- clone your website code `$ git clone https://github.com/MurphyPone/example-flask-website`, _link to how to use github_

NEEDS TO BE port 0.0.0.0, and we need to reroute traffic using misha's command: 

`sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000`


----- this stuff probably doesn't work: 
```
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
``` 

https://cloud.google.com/appengine/docs/standard/python3/building-app/creating-gcp-project
https://cloud.google.com/sdk/docs#deb

- create app.yaml from [here]()
- do the authentication step `gcloud auth application-default login`

website will be static (define, as opposed to dynamic)



## Alternatively

install the `gcloud` SDK, authenticate with `gcloud auth login` then `gcloud projects list` to view ours

```
$ gcloud projects list
PROJECT_ID                 NAME                       PROJECT_NUMBER
electric-elephant-website  Electric Elephant Website  612669463975g
```

### following [their docs]https://cloud.google.com/python/tutorials/getting-started-on-compute-engine) for Compute Engine -- explain the difference 

1. we're working from within the gce folder
2. cloudshell is distinct from our instance

### EITHER WAY AFTER THAT, WE GOTTA DO CLOUD DNS

1. Network services > create a zone
2. Add A records -- trouble here if using the `gcloud` tool since it deploys to appspot, not the ip
3. at DDC, change nameservers to `ns-cloud-e1.googledomains.com` 1 and two
4. VPC Networks > External IP Addresses --> change from ephemeral to static



> Manage domain name servers. You can find your domain name servers (DNS) and switch to custom name servers. Changes to DNS settings might take between several minutes and up to 48 hours to update.



-- trying again Sep 1 
from [here](https://cloud.google.com/python/tutorials/getting-started-on-compute-engine)

1. Create project 
2. Enable the Compute Engine API
    - API overview > Enable > Compute Engine
3. hit Cloud shell from dashboard in the top right, wait for it to provision
4. set the `gcloud` config with `gcloud config set project YOUR_PROJECT_ID`, which can be found in the project view menu in the hamburger dropdown in top left of dashboard

```
$ gcloud config set project gcp-take-5-288302
Updated property [core/project].
```


5. clone your repo [google's](https://github.com/GoogleCloudPlatform/getting-started-python/tree/master/gce)

6. install the requirements:

```
flask==1.1.2
honcho==1.0.1
gunicorn==19.9.0
```

and for some reason, double install the gunicorn one? `pip3 install gunicorn --user`

7. chmod the startup script and run it 
8. follow the steps then go to cloud DNS