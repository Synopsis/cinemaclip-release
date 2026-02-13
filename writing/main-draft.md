
- [ ] Chart with comparison across num. params, training dataset size

## Intro

CinemaCLIP is a model and a collection of datasets that represent a comprehensive taxonomy of cinematography at the frame level. We evaluate existing leading CLIP models ( #TODO and VLMs? ) against these datasets to find that leading models have a fundamental gap in their understanding of nuances of the visual language of cinema. We're also releasing a fine-tuned CLIP model that outperforms all existing models by ~34% across these 22 datasets, while retaining general capabilities across other domains, and running 8x faster than realtime {on X device}.

< Chart showing CinemaCLIP vs. other SOTA CLIP models >

### What Is Visual Language?

When you write in any language, you're using the rules of grammar to put forth your point, regardless of whether that's a conscious effort or not. Images have a similar visual grammar. Filmmakers and photographers are experts of this language, but this language doesn't just apply to their work, it permeates across every photo you've ever taken in your life. 

Concretely, how you frame the image, where you place your subject in the frame, where the camera is relative to them, the angle the camera is at, the various aspects of color -- saturation, contrast, tonality, palette, and similarly, the various aspects of lighting, are all part of this language. Take a look at the visual browser below to see some of these concepts at a glance.

### Why Does It Matter For AI?

PS: I'm not sure if we want this section.

Every big image / video GenAI player has focused on controllability and specificity. 

< Show a bunch of article splats of advertised features around visual language -- most commonly camera control >

--- What I really wanna say: Most of these companies advertise controllability of concepts but they don't even know what some of these concepts mean! Plenty of examples: ...

## The Dataset

< Taxonomy Browser >
< Display every category's results to the right side of the browser? >

## Training CinemaCLIP

### Loss Design

CLIP learns by matching images to captions. Whether it's the original contrastive loss or SigLIP's sigmoid formulation, the fundamental task is the same: given a batch of images and captions, figure out which caption goes with which image. 

Crucially, what's in the caption limits what the model can learn. Captions from standard datasets capture a sliver of what's in the image. 

< Show examples >

The most obvious antidote to this problem is richer captions. LongCLIP showed that most CLIP models have an effective context length of ~20 tokens -- a side effect of existing datasets -- and demonstrated gains from extending the actual and effective context length. In the VLM space, Molmo took this further to great effect with exhaustive captions for pre-training:

< Show LongCLIP and Molmo examples >

However, these approaches still collapse all information into a single caption. Now instead of matching captions to images, you're matching essays to images. While this solves the information problem, it introduces a precision problem: the model can satisfy the objective by latching onto whichever concepts are easiest to match and ignore the rest. You also can't construct meaningful negatives against essays.

#### The solution: Decomposition
Visual grammar is structured and consists of concepts that are mutually exclusive. Instead of mushing them all into a single long caption, we treat this as a multi-task problem, running 8 parallel tasks that all attend to distinct aspects of the image.

< Show image of all cinematic info crammed into a single image. Compare side by side with 8 different captions distinctly >

Not only is this much more readable, it's a fundamentally better training formulation. When we trained with a single caption with all the info, the model simply didn't learn the concepts well, but by separating it into multiple distinct tasks, we saw a ~14% improvement.

< Show graph of results with 1 caption, 2 captions, and 8 captions >


### Preserving "General" Knowledge



## Results

Zero-shot accuracy is a good proxy for accuracy of natural language search, but nothing beats classifier based tags for highly precise filters. Additionally, having language search + tag based filtering for specific concepts leads to much better compositionality of searches as well. Classification, in a nutshell, is adding a linear layer on top CLIP embeddings. Surprisingly to us, adding 22 classification tasks in addition to 8 contrastive tasks led to no loss of zero-shot metrics in both domain specific and general tasks, and led to far superior performance on domain specific tasks, matching the performance of the much larger teacher models that labelled this data!

< Chart from start of article, with classifiers added >

### Latent Space

< Show some sample prompts and A/B test with SOTA models >
- This visualisation could be quite rich. The "A" would be CinemaCLIP, and "B" could be swapped for any of the SOTA models. Depending on which B you pick, there should also be a section that shows the plots -- 0-shot Cinematic and 0-shot ImageNet for a clear snapshot comparison

## Conclusion




---

## Points I want to make

### General
- Visual language is a part of every photo you see and take, not just the cinematic ones. Use the grammar analogy
-  The language of cinema is grounded in specifics, but is fundamentally a cultural one

### Technical
#### Training
- Needed to fine-tune both text and vision encoder to see gains
- Roads not taken
- Failed / abandoned ideas
- Counterintuitive findings
	- Masking empty labels hurt performance
	- Deduplicating labels hurt performance
- Findings consistent across multiple prompting styles. Imagenet style prompting is meaningless because it essentially crams a ton of nuanced concepts into a single pool of prompts



# Archive

## Training CinemaCLIP


It's worth reminding ourselves just how influential this architecture has been. First released in 20xx by OpenAI, CLIP showed what was possible when bringing together modalities like image and text that were previously largely treated separately.* CLIP underpins image and video generators, and is the 'vision' component of every Vision-LLM variant.

Before we dig into hyperparameters, it's critical to look at existing approaches to training CLIP and some sample data. From an _architecture_ pov, ViTs are the dominant choice, with CNN hybrids like Apple's FastViT and Meta's ConvNeXT also offering solid accuracy and runtime performance. 

From a NN _optimisation_ perspective: the original CLIP was trained using standard contrastive loss. SigLIP, the most popular choice for larger VLMs today, introduced the sigmoid formulation of the same task. Fundamentally however, the core task is the same for both these formulations: _match the correct caption to the image_.
There is a subfield of CLIP research that focuses on negation[^1] where the key idea is that for each caption that describes what's _in the image_, there's also a caption that describes _what isn't_. 

< Show an image with positive, negative, hard-negative caption >

This forces the model to go beyond matching a bag of words to an image, and forces it to learn more fine-grained distinctions.

#Needs-Revisiting
> META: Need to have a tighter connection here and smoother transition from plain training -> negative captioning -> multiple positive captions

A picture is worth a thousand words is an adage that training CLIP models adds new color to. Most CLIP models have an effective context length of 20 i.e. (X words), and capture a very small aspect of what's in the image. When the training paradigm is to match captions to images, if your captions don't contain crucial information, the model is never going to learn to make those associations. One approach would be to cram all information about the image into a single long caption. This has been tried in some CLIP papers, and to great success by [[@deitke_2024_molmo_pixmo_open|Molmo]] in the VLM space. However, look at this caption:

< Show a molmo / pixmo caption >

Good luck designing a hard negative for this. Also, from a training perspective, this caption makes sense as a pre-training objective for a VLM, but not so much for image-caption matching. There are multiple different concepts being described here that could benefit from more a better structured loss formulation.

Let's come back to visual language. Click around below to see different ways to describe the image and how we could build up a caption.
< >

As you can see, different descriptors attend to different aspects of the image, and all of these aspects are mutually exclusive by design, and may or may not exist for a given image (one image may have strong _centered_ composition, whereas another may not be opinionated enough to have a composition tag).

These captions are also much more readable and closer to how a human may search for an image. You often think of an aspect of the image, not an exhaustive description of it.
As we found out, this makes for a very effective formulation for training CLIP. It's a simple extension of the classic CLIP loss, but instead of one image-caption pair, you have N parallel tasks where each captures a distinct aspect, and simply sum the losses. **Adding more tasks led to better performance**, as you can see below:

< Chart showing one cap vs. 2 caps vs. 8 caps >



[^1]: There's also another fascinating topic in CLIP research - compositionality. [[@brody_2023_potential_clip_compositional]] and [[@kang_2025_clip_ideal_no]] both show fundamental limitations of a rank-1 CLIP embedding space, and the latter shows an interesting solve for the same using 2D embeddings. Also worth seeing: [[@hsieh_2023_sugarcrepe_fixing_hackable]]
