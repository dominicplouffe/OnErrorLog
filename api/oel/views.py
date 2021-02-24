def manifest(request):
    return render(request, "build/manifest.json")


def index(request):
    return render(request, "build/index.html")


def handler404(request, *args, **argv):
    response = rrender_to_response('404.html', {},
                                   context_instance=RequestContext(request))
    response.status_code = 404
    return response
