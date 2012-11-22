Game.addClass({
	'name': 'Pion',
	'eventCreate': function()
	{
		this.sprite=new Sprite(Game.getImage('pions'));
		this.sprite.makeTiles(64,64);
		this.sprite.tiles=[1];
		
		this.empty=true;
		this.mouseOver=false;
		this.player=1;
		this.error=false;		
		this.sprite.imagespeed=0.4;
	},
	'eventStartStep': function()
	{
		if(this.error)
		{
			this.sprite.tiles=[7,8,9,8,7,8,9,8];
		}
		else if(this.empty)
		{
			if(this.isMouseOver())
			{
				var mouse=Game.getMouse();
				this.mouseOver=true;
				
				if(mouse[0]%64!=0 && mouse[1]%64!=0)
				{
					this.sprite.tiles=[4,5,6,5];
				}
			}
			else
			{
				this.mouseOver=false;
				this.sprite.tiles=[1];
			}
		}
		else
		{
			this.sprite.tiles=[this.player+1];
		}
	},
	'eventClick': function()
	{
		if(this.empty && Controlor.id_player==1)
		{
			if(this.mouseOver)
			{
				cases_adjacentes=Controlor.getAdjacentes(this);
				
				var ok=false;
				for(var i=0, l=cases_adjacentes.length; i<l; i++)
				{
					if(cases_adjacentes[i])
					{
						if(!cases_adjacentes[i].empty)
						{							
							if(Controlor.id_joueur!=cases_adjacentes[i].player)
							{
								var betweenCases=this.getPions(i);
								if(betweenCases!==false)
								{									
									for(var j=0, l2=betweenCases.length; j<l2; j++)
									{
										betweenCases[j].player=Controlor.id_player;
									}
									
									ok=true;
								}
							}
						}
					}
				}
				
				if(ok)
				{
					if(this.empty)
					{
						this.empty=false;
						this.player=Controlor.id_player++;
						
						Controlor.updateScores();
						
						if(Controlor.id_player>2)
						{
							Controlor.id_player=1;
						}
						
						if(Controlor.id_player==1)
						{
							document.getElementById('joueur').style.backgroundPosition='-64px 0';
						}
						else
						{
							document.getElementById('joueur').style.backgroundPosition='-128px 0';
							setTimeout(function(){Controlor.ia()},2000);
						}
					}
				}
				else if (this.mouseOver)
				{
					this.error=true;
					this.sprite.imageindex=0;
				}
			}
		}
	},
	'getIndexes': function()
	{
		return [this.x/64,this.y/64];
	},
	'getPions': function(sens)
	{
		var indexes=this.getIndexes(),
			i=indexes[0],
			j=indexes[1],
			deltaI=0,
			deltaJ=0,
			pions=[];
		
		switch(sens)
		{
			//Left
			case 0:
				deltaI=-1;
			break;
			
			//Top
			case 1:
				deltaJ=-1;
			break;
			
			//Right
			case 2:
				deltaI=1;
			break;
			
			//Down
			case 3:
				deltaJ=1;
			break;
			
			//Top_Left
			case 4:
				deltaI=-1;
				deltaJ=-1;
			break;
			
			//Top_Right
			case 5:
				deltaJ=-1;
				deltaI=1;
			break;
			
			//Bottom_Left
			case 6:
				deltaJ=1;
				deltaI=-1;
			break;
			
			//Bottom_Right
			case 7:
				deltaJ=1;
				deltaI=1;
			break;
		}
		
		i+=deltaI;
		j+=deltaJ;
		
		while(i!=-1 && i!=8 && j!=-1 && j!=8)
		{
			var pion=Controlor.pions[i][j];

			if(pion.empty)
			{
				return false;
			}
			else if(pion.player!=Controlor.id_player)
			{
				pions.push(pion);
				i+=deltaI;
				j+=deltaJ;
			}
			else
			{
				return pions.length>0?pions:false;
			}
		}
		
		return false;
	},
	'eventEndAnimation': function()
	{
		if(this.error)
		{
			this.error=false;
		}
	}
});