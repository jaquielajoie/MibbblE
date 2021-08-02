from django.shortcuts import render


def index(request):
    # testing
    return render(request, 'info/index.html')
