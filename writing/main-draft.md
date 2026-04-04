# Introducing CinemaCLIP

A hybrid CLIP model and taxonomy for the visual language of cinema

At OZU, our goal is to build ML systems that deeply understand the art of cinema and visual story telling. In pursuing that goal, we noticed a qualitative gap; existing ML models that bridge natural language and vision massively underperform when tasked with understanding cinematic concepts compared to humans, especially domain experts like cinematographers, editors, and directors.

To understand this gap, we first carefully created a taxonomy of cinematic concepts by working with industry specialists. We then evaluated existing models, as well as our own Cinema family of models against a new set of benchmark datasets.

What we found matched our qualitative assesement; evaluating leading CLIP models against these datasets shows a fundamental gap in their understanding of the nuances of visual grammar. Furthermore, model scale alone does not solve this problem; models up to X× larger still fail to capture the structure of cinematic visual language. This limits their usefulness in real-world professional video tasks where understanding visual language is critical.

The result of our work is a new model; CinemaCLIP, and a collection of 22 datasets that represent an extensive taxonomy of professional visual language.

< OVERALL ACCURACY DOT PLOT: CINEMACLIP VS BASELINES ACROSS CATEGORIES >

CinemaCLIP is a hybrid CLIP model that pairs zero-shot inference with specialised classification heads, outperforming existing CLIP models as well as state of the art Vision Language models in both zero shot inference and one shot classification tasks.

**Authors**  
Rahul Somani  
Anton Marini  
Damian Stewart  

**Published**  
20 Feb, 2026  

**HuggingFace**  
Released artifacts ↗  

---

## The Problem

Cinematographers, photographers, editors and directors all use very specific language to describe imagery on the job. However their language can be fuzzy, and not all cinematographers and photographers share the same opinion of when a "close up shot" begins, and a "medium shot" ends. Furthermore, industry terms of art often attempt to capture multiple competing visual concepts which lead to poor machine interpretability. 

Modern models are trained on internet scale data, of which most captions are from are non-experts, and do a poor or even incorrect job at describing an image. The result are models which have a fuzzy understanding of these specific terms of art, and are less effective when used in professional contexts.

For some many use cases, internet scale data along with correct training formulations result in models that out perform non-expert users. But these models also vastly underperform when compared to trained professionals. If your use case is to build intelligent tools for professionals, this gap in performance matters. 

## The Gap In Existing Approaches

CLIP learns by matching images to captions. Whether it's the original contrastive loss or SigLIP's sigmoid formulation, the fundamental task is the same: given a batch of images and captions, figure out which caption goes with which image.

< CLIP DIAGRAM >

Crucially, what's in the caption limits what the model can learn. Existing captions from industry standard datasets capture a sliver of what's meaningful in the image. Specifically, this is an information problem; existing captions don’t consistently encode information (e.g. shot size, camera angle, composition), so the model never learns them.  The limitation is not the architecture but the dataset. Let's look at some sample data and captions to show what this really means, and why they don't work.

< LAION EXAMPLES WITH WEB LIKE CAPTIONS >

The most obvious antidote to this problem is richer captions. [LongCLIP](https://arxiv.org/abs/2403.15378) showed that most CLIP models have an effective context length of ~20 tokens (a side effect of existing datasets) and demonstrated gains from extending the actual and effective context length. In the VLM space, [Pixmo (Molmo)](https://arxiv.org/abs/2409.17146) took this further to great effect with exhaustive captions for pre-training:

< PIXMO & SHAREGPT4V ESSAY LENGTH CAPTION EXPLORER > [see this doc](./laion-pixmo-sharegpt4vcoco-examples.md)

To the untrained eye, these captions appear exhaustive, but there's often little to no information about the visual grammar of the image from the perspective of a domain expert / industry professional. 

Instead of matching concise captions to images, you're now matching essays to images. While this solves the information problem in principle, it introduces a precision problem: the model can satisfy the objective by matching whichever visual features are easiest, and ignore the rest, without ever learning structured visual concepts. 

## The solution: Decomposition

Visual language has a grammar, and this grammar is structured and consists of visual concepts that are mutually exclusive. Instead of combining them all into a single long caption, we treat this as a multi-task problem, running 8 parallel tasks that all attend to distinct aspects of the image. 

In other words, instead of asking one question: ‘what’s in this image?’, we ask multiple focused questions:
* What is the shot type?
* What is the camera angle?
* What is the lighting style?
* What is the composition? 

Each is learned independently, but from the same underlying image.

Not only is this much more readable to the human eye, it's a fundamentally better training formulation. Each task provides a clean, unambiguous training signal, preventing the model from collapsing multiple concepts into a single representation. Adding this structure allows us to learn multiple dimensions of the same image concurrently, leading to a ~14% improvement over the basic single caption formulation. This approach is also compatible with learning negation, offering additional opportunities for the model to learn appropriate features.

< EXAMPLES OF IMAGES WITH 1 CAPTION VS. 8 CAPTIONS>

In addition to 8 captioning tasks, we also had 23 dedicated classification task heads - a combination of single-label, multi-label, and binary classifiers per concept. The data for these tasks was generated automatically by specialist in-house models we've developed over the past few years. See our [CVEU 2021](https://youtu.be/7aYgLALc_24?t=32741) talk from 2021 for more details.

< VISUAL TAXONOMY EXPLORER >

## Dataset Size

As seen above, CinemaCLIP is trained on cinematic data. Our data set consists of a validation set hand labelled (and re-labelled multiple times) by domain experts. We fine tuned domain-specific teacher models for individual aspects of visual grammar (e.g. shot type, lighting, composition), and used them to generate high-confidence labels at scale. Finally we generated our training datasets via our teacher models. We encourage you to check out our talk at [CVEU 2021](https://youtu.be/7aYgLALc_24?t=32741) for more details regarding the process.

Our data set consisted of 750k samples with human labelled tags. Another 750k images from DataComp was labeled by our teacher models to maintain a 50-50 split of generalist labels and visual domain expertise  to preserve generalist knowledge in the models.


## Cinematic Performance

Here is a categorical comparison of CinemaCLIP against the leading existing CLIP models and state of the art VLMs across all our cinematography datasets. The solid dot is CinemaCLIP zero-shot and the ring is with classifier heads — grey dots are existing models.

< CHART SHOWING 23 INDIVIDUAL CLASSIFIERS ACCURACY >

---


## 'General' Knowledge Retention / Improvement

We also don't want to over-specialize. Its important for our models to retain a wide understanding of general concepts so that existing functionality is retained. To that end, we validate our data set and multi task training approach by using existing datasets as proxies for generalist tasks. CinemaCLIP retains good generalist knowledge, and we intentionally trade ~7% ImageNet accuracy for significantly improved performance on real-world visual tasks relevant to our users. 


< 4 CHARS OF NON-CINEMAIC TASK ACCURACY >

Note that there are many different concepts, many of which could command dedicated taxonomies and tasks themselves (and indeed, there are many publicly available datasets in many of these domains), but we lumped them all into two tasks as our focus was teaching CLIP the language of cinema. Coverage of these concepts is far from exhaustive throughout the dataset. Regardless, we saw a notable improvement in accuracy across most of these tasks compared to the pre-trained model. On the other hand, we lost ~7% accuracy on ImageNet, but this not surprising given the nature of our dataset, and the model held up quite well in real world usage.

### Latent Space Comparisons | Text Embedding Comparisons

< CVEU LIKE SIDE BY SIDE COMPARISON >

## Conclusion

We believe CinemaCLIP offers a demonstrable improvement over CLIP and VLM models for many industry professional use cases. With a x% improvement over the latest VLMs, CinemaClip can be run on commodity hardware on edge, at greatly faster than real-time rates. This enables opportunities like real-time video search and retrieval systems, live camera assist systems, on set validation, and more. 

CinemaCLIP is one part of a family of models and techniques that we built at OZU to understand the art of visual storytelling, and is the backbone for a suite of tools and processes that power OZU's state of the art narrative understanding systems.   

Stay tuned for more.


### Technical Addendum

## Note on Generalist Knowledge

Zero-shot accuracy on ImageNet-1K is a popular proxy for measuring a CLIP models' general performance. ImageNet is an object centric dataset and doesn't capture a lot of the nuance our users care about in real world usage. 

For instance, about 12% of ImageNet consists of dog breeds. There is little to no representation for the color of objects, materials, and textures. 'General' is a nebulous term; to measure 'general knowledge' in the way relevant to our use cases, we constructed 39 datasets that are a non-exhaustive representation of the types of search terms we care about. The captions in 'Task 1' displayed in "" Figure Something Above "" have data relevant to these concepts. Take a look at some of these annotated images to get a sense of the types of data we're talking about here.

## Note on Training Dynamics & Hyperparameters

Fine-tuning CLIP models can be fiddly. We found that we needed to adapt our approach depending on the architecture being trained. Here's some key hyperparameters we needed to tune:

- No. of layers fine-tuned in the vision encoder  |  6  | Sweet spot
- No. of layers fine-tuned in the text encoder  |  3  | Sweet spot
- Data ratio between pre-trained data and new data  |  50%  |  
- Confidence threshold of auto-labelled tags  |  0.85  | Identical performance on ImageNet; 0.85 led to about 10% better performance on cinematic tasks, as the training data was more precise
- No. of training tasks  |  8  | This was the sweet spot. Going longer meant losing too much 'general' knowledge for a marginal gain in cinematic understanding
- No. of epochs / steps trained  |  3 epochs  |  This was the sweet spot. Going longer meant losing too much 'general' knowledge for a marginal gain in cinematic understanding
- Learning rate  |  2e-5 for CLIP, 2e-3 for classifier heads  |  Used Leslie Smith / FastAI's LR finder technique to find the sweet spot
- Alpha blending ratio  |  0.75  |  Alpha=1.0 means fully fine-tuned ratio. This led to +1% accuracy on classifiers, equivalent 0-shot cinematic, and -7% on ImageNet

