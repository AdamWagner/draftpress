from django.shortcuts import render
from django.template import RequestContext
# Create your views here.



def home(request):
    user = request.user
    context = {
        "logged_in": user.is_authenticated(),
        "user": user
    }
    request_context = RequestContext(request, context)
    return render(request, "marketing/home.html", context_instance=request_context)